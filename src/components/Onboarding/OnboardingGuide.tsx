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
    switch (position) {
      case "center":
        return "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      case "bottom":
        return "fixed bottom-24 left-1/2 -translate-x-1/2";
      case "top-left":
        return "fixed top-24 left-8";
      case "top-right":
        return "fixed top-24 right-8";
      default:
        return "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
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
            <Card className="w-[360px] p-6 bg-white/95 shadow-xl backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
                {step.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {currentStep === 0 && (
                    <Button variant="ghost" onClick={handleSkip} size="sm">
                      Skip
                    </Button>
                  )}
                  <Button onClick={handleNext} size="sm">
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
