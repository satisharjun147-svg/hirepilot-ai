import { useState } from "react";
import HomeScreen from "./pages/HomeScreen";
import ResumeBuilder from "./pages/ResumeBuilder";
import ImproveResume from "./pages/ImproveResume";
import ATSChecker from "./pages/ATSChecker";
import CoverLetter from "./pages/CoverLetter";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import InterviewCoach from "./pages/InterviewCoach";
import Login from "./pages/Login";
import MyResumes from "./pages/MyResumes";
import MyCoverLetters from "./pages/MyCoverLetters";
import MyATSReports from "./pages/MyATSReports";
import Dashboard from "./pages/Dashboard"; // Added Import

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

  if (activeFeature === "myresumes") {
    return <MyResumes onBack={goHome} />;
  }

  if (activeFeature === "mycoverletters") {
    return <MyCoverLetters onBack={goHome} />;
  }

  if (activeFeature === "myatsreports") {
    return <MyATSReports onBack={goHome} />;
  }

  // Added Route for Dashboard
  if (activeFeature === "dashboard") {
    return <Dashboard onBack={goHome} />;
  }

  if (activeFeature === "login") {
    return <Login onBack={goHome} />;
  }

  return <HomeScreen onOpen={openFeature} />;
}