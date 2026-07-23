import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import {
  Camera,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  User,
  Globe,
  Languages,
  FileText,
  Sparkles,
} from "lucide-react";
import { LANGUAGES } from "../constants/index.js";
import logo from "../assets/logo.png";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: OnboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      toast.success("Profile onboarded successfully");
      queryClient.setQueryData(["authUser"], data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) =>{
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    OnboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://robohash.org/user${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-base-300 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="border border-primary/20 bg-base-100 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl mx-auto p-6 sm:p-10 relative z-10">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={logo}
            alt="Duckling Logo"
            className="size-14 object-contain mb-3 hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary">
            Complete Your Profile
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Let's personalize your experience before you start matching and chatting!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PROFILE PIC CONTAINER */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-2">
            <div className="relative group size-32 rounded-full ring-4 ring-primary/20 hover:ring-primary/50 transition-all duration-300 bg-base-200 overflow-hidden flex items-center justify-center shadow-inner">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-base-content/40 group-hover:text-primary transition-colors duration-200">
                  <Camera className="size-12 group-hover:scale-110 transition-transform duration-200" />
                </div>
              )}
            </div>

            {/* RANDOM IMAGE BUTTON */}
            <button
              className="btn btn-outline btn-accent btn-sm gap-2 rounded-full hover:shadow-md transition-all duration-200"
              type="button"
              onClick={handleRandomAvatar}
            >
              <ShuffleIcon className="size-4" />
              Generate Random Avatar
            </button>
          </div>

          {/* FULL NAME */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                <User className="size-4 text-primary" /> Full Name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <User className="size-5" />
              </div>
              <input
                className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          {/* BIO */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> Bio
              </span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-base-content/40">
                <FileText className="size-5" />
              </div>
              <textarea
                className="textarea textarea-bordered w-full pl-10 h-24 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 leading-relaxed"
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                placeholder="Tell others a bit about yourself..."
              />
            </div>
          </div>

          {/* LANGUAGES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NATIVE LANGUAGE */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                  <Globe className="size-4 text-primary" /> Native Language
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Globe className="size-5" />
                </div>
                <select
                  className="select select-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LEARNING LANGUAGE */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                  <Languages className="size-4 text-primary" /> Learning Language
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Languages className="size-5" />
                </div>
                <select
                  className="select select-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" /> Location
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <MapPinIcon className="size-5" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                name="location"
                value={formState.location}
                onChange={(e) => {
                  setFormState({ ...formState, location: e.target.value });
                }}
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center pt-3">
            <button
              className="btn btn-primary w-full sm:w-2/3 md:w-1/2 shadow-lg shadow-primary/20 hover:shadow-primary/40 font-semibold tracking-wide gap-2 transition-all duration-200"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5" />
                  Onboarding...
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;

