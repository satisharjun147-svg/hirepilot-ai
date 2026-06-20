import { useState } from "react";
import HomeScreen from "./pages/HomeScreen";
import ResumeBuilder from "./pages/ResumeBuilder";
import ImproveResume from "./pages/ImproveResume";
import ATSChecker from "./pages/ATSChecker";
import CoverLetter from "./pages/CoverLetter";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import InterviewCoach from "./pages/InterviewCoach";

export default function AIResumeBuilder() {
  const [homeScreen, setHomeScreen] = useState(true);
  const [activeFeature, setActiveFeature] = useState("home");

  const goHome = () => {
    setHomeScreen(true);
    setActiveFeature("home");
  };

  const openFeature = (feature) => {
    setActiveFeature(feature);
    setHomeScreen(false);
  };

  if (homeScreen) {
    return <HomeScreen onOpen={openFeature} />;
  }

  if (activeFeature === "resume") {
    return <ResumeBuilder onBack={goHome} />;
  }

  if (activeFeature === "improve") {
    return <ImproveResume onBack={goHome} />;
  }

  if (activeFeature === "ats") {
    return <ATSChecker onBack={goHome} />;
  }

  if (activeFeature === "coverletter") {
    return <CoverLetter onBack={goHome} />;
  }

  if (activeFeature === "linkedin") {
    return <LinkedInOptimizer onBack={goHome} />;
  }

  if (activeFeature === "interview") {
    return <InterviewCoach onBack={goHome} />;
  }

  return <HomeScreen onOpen={openFeature} />;
}