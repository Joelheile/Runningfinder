"use client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import AvatarUploader from "@/components/Upload/AvatarUploaderLogic";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../UI/dialog";
import { Progress } from "../UI/progress";

interface AddClubUIProps {
  name: string;
  description: string;
  stravaUsername: string;
  instagramUsername: string;
  avatarFileId: string;
  isUploaded: boolean;
  isOpen: boolean;
  step: number;
  totalSteps: number;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleStravaUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInstagramUsernameChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUploadChange: (uploaded: boolean, url: string | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function AddClubUI({
  name,
  description,
  stravaUsername,
  instagramUsername,
  avatarFileId,
  isUploaded,
  isOpen,
  step,
  totalSteps,
  handleNameChange,
  handleDescriptionChange,
  handleStravaUsernameChange,
  handleInstagramUsernameChange,
  handleUploadChange,
  handleSubmit,
  handleClose,
  setIsOpen,
  nextStep,
  prevStep,
}: AddClubUIProps) {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button id="add-club-trigger" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Club
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:max-h-[80vh] overflow-y-auto px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Club
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span>
                Step {step} of {totalSteps}:
              </span>
              <span className="font-medium">
                {step === 1 ? "Basic Information" : "Social Media (Optional)"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            // Only submit if we're on the last step
            if (step !== totalSteps) {
              e.preventDefault();
              return;
            }
            handleSubmit(e);
          }}
          className="space-y-4 sm:space-y-6 py-3 sm:py-4"
        >
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Club Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Berlin Running Crew"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">
                  Club Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Share your club's story and what makes it special"
                  className="w-full min-h-[80px] sm:min-h-[100px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                All fields on this page are optional. Fill in what you&apos;d
                like to share.
              </p>

              <div className="space-y-2">
                <Label
                  htmlFor="instagramUsername"
                  className="text-sm sm:text-base"
                >
                  Instagram Username
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    @
                  </span>
                  <Input
                    id="instagramUsername"
                    value={instagramUsername}
                    onChange={handleInstagramUsernameChange}
                    className="w-full pl-8"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="stravaUsername"
                  className="text-sm sm:text-base"
                >
                  Strava Club Username
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    @
                  </span>
                  <Input
                    id="stravaUsername"
                    value={stravaUsername}
                    onChange={handleStravaUsernameChange}
                    className="w-full pl-8"
                    placeholder="Username"
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Just the username part from your Strava club URL
                </p>
              </div>

              <div className="space-y-2">
                <div className="mt-1">
                  {!instagramUsername && (
                    <>
                      <Label
                        htmlFor="avatar"
                        className="block text-sm sm:text-base"
                      >
                        Club Logo
                      </Label>

                      <AvatarUploader
                        id={avatarFileId}
                        onUploadChange={handleUploadChange}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4 sm:mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              type={step === totalSteps ? "submit" : "button"}
              onClick={(e) => {
                if (step !== totalSteps) {
                  e.preventDefault();
                  nextStep();
                }
              }}
              className={`text-sm sm:text-base px-3 sm:px-4 ${step === 1 ? "w-full" : ""}`}
            >
              {step === totalSteps ? "Create Club" : "Next"}
              {step === totalSteps ? "" : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
