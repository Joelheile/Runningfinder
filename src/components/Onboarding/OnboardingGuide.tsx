import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../UI/button";
import { Card } from "../UI/card";

interface OnboardingStep {
  title: string;
  description: string;
  position: "center" | "bottom" | "top-left" | "top-right";
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to RunningFinder! 👋",
    description:
      "Your personal guide to discovering local running clubs and group runs. Let's get you started!",
    position: "center",
  },
  {
    title: "Interactive Map View",
    description:
      "This map shows all running clubs in your area. Each marker represents a club with upcoming runs. Click them to explore!",
    position: "center",
  },
  {
    title: "Choose Your Running Days",
    description:
      "Select which days of the week work best for you. The map will update to show runs happening on those days.",
    position: "top-left",
  },
  {
    title: "Pick Your Level 🏃‍♂️",
    description: `Easy (🟢): Social runs under 10km
Intermediate (🟡): Structured runs 10-15km
Advanced (🔴): Technical workouts or 15km+`,
    position: "top-right",
  },
  {
    title: "Find Your Club",
    description:
      "Click 'Search Clubs' to browse detailed club profiles and find your perfect running community!",
    position: "bottom",
  },
];

export function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      localStorage.setItem("hasSeenOnboarding", "true");
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  const getPositionClasses = (position: string) => {
    const baseClasses = "fixed mx-4 sm:mx-0 max-w-[90vw] sm:max-w-lg";
    const mobileClasses = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

    switch (position) {
      case "center":
        return `${baseClasses} ${mobileClasses} sm:${mobileClasses}`;
      case "bottom":
        return `${baseClasses} ${mobileClasses} sm:top-auto sm:bottom-24 sm:-translate-y-0`;
      case "top-left":
        return `${baseClasses} ${mobileClasses} sm:top-24 sm:left-8 sm:-translate-y-0 sm:translate-x-0`;
      case "top-right":
        return `${baseClasses} ${mobileClasses} sm:top-24 sm:right-8 sm:left-auto sm:-translate-y-0 sm:translate-x-0`;
      default:
        return `${baseClasses} ${mobileClasses} sm:${mobileClasses}`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`${getPositionClasses(step.position)} z-50`}
          >
            <Card className="w-full sm:w-[480px] p-4 sm:p-6 bg-white/95 shadow-xl backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 whitespace-pre-line leading-relaxed [&>strong]:font-bold">
                {step.description.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line.startsWith("Easy") ? (
                      <>
                        <strong>Easy</strong>
                        {line.slice(4)}
                      </>
                    ) : line.startsWith("Intermediate") ? (
                      <>
                        <strong>Intermediate</strong>
                        {line.slice(12)}
                      </>
                    ) : line.startsWith("Advanced") ? (
                      <>
                        <strong>Advanced</strong>
                        {line.slice(8)}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
                <div className="flex gap-1.5 justify-center sm:justify-start">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 justify-center sm:justify-end">
                  {currentStep === 0 && (
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
