import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const ImproveResume = lazy(() => import("./pages/ImproveResume"));
const ATSChecker = lazy(() => import("./pages/ATSChecker"));
const CoverLetter = lazy(() => import("./pages/CoverLetter"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const InterviewCoach = lazy(() => import("./pages/InterviewCoach"));
const Login = lazy(() => import("./pages/Login"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const MyCoverLetters = lazy(() => import("./pages/MyCoverLetters"));
const MyATSReports = lazy(() => import("./pages/MyATSReports"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));

export default function AIResumeBuilder() {
  const getInitialFeature = () => {
    const feature = new URLSearchParams(window.location.search).get("feature");
    return feature || "home";
  };

  const initialFeature = getInitialFeature();
  const [homeScreen, setHomeScreen] = useState(initialFeature === "home");
  const [activeFeature, setActiveFeature] = useState(initialFeature);
  const routeStackRef = useRef(initialFeature === "home" ? [] : [initialFeature]);

  const syncUrl = (feature, history = routeStackRef.current, replace = false) => {
    const url = new URL(window.location.href);

    if (!feature || feature === "home") {
      url.searchParams.delete("feature");
    } else {
      url.searchParams.set("feature", feature);
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const state = { feature: feature || "home", history };

    if (replace) {
      window.history.replaceState(state, "", nextUrl);
    } else {
      window.history.pushState(state, "", nextUrl);
    }
  };

  const goHome = () => {
    routeStackRef.current = [];
    setHomeScreen(true);
    setActiveFeature("home");
    syncUrl("home", [], true);
  };

  const goBack = (mode = "back") => {
    if (mode === "home") {
      goHome();
      return;
    }

    if (routeStackRef.current.length > 1) {
      window.history.back();
      return;
    }

    goHome();
  };

  const openFeature = (feature, options = {}) => {
    const resolvedFeature = feature || "home";

    if (options.newTab) {
      const url = new URL(window.location.href);

      if (!resolvedFeature || resolvedFeature === "home") {
        url.searchParams.delete("feature");
      } else {
        url.searchParams.set("feature", resolvedFeature);
      }

      window.open(url.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    const nextHistory = resolvedFeature === "home" ? [] : [...routeStackRef.current, resolvedFeature];
    routeStackRef.current = nextHistory;
    setActiveFeature(resolvedFeature);
    setHomeScreen(resolvedFeature === "home");
    syncUrl(resolvedFeature, nextHistory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const nextFeature = event.state?.feature || new URLSearchParams(window.location.search).get("feature") || "home";
      const resolvedFeature = nextFeature === "home" ? "home" : nextFeature;

      routeStackRef.current = event.state?.history || [resolvedFeature];
      setActiveFeature(resolvedFeature);
      setHomeScreen(resolvedFeature === "home");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  let screen;

  if (homeScreen) {
    screen = <HomeScreen onOpen={openFeature} />;
  } else if (activeFeature === "resume") {
    screen = <ResumeBuilder onBack={goBack} />;
  } else if (activeFeature === "improve") {
    screen = <ImproveResume onBack={goBack} />;
  } else if (activeFeature === "ats") {
    screen = <ATSChecker onBack={goBack} />;
  } else if (activeFeature === "coverletter") {
    screen = <CoverLetter onBack={goBack} />;
  } else if (activeFeature === "linkedin") {
    screen = <LinkedInOptimizer onBack={goBack} />;
  } else if (activeFeature === "interview") {
    screen = <InterviewCoach onBack={goBack} />;
  } else if (activeFeature === "myresumes") {
    screen = <MyResumes onBack={goBack} />;
  } else if (activeFeature === "mycoverletters") {
    screen = <MyCoverLetters onBack={goBack} />;
  } else if (activeFeature === "myatsreports") {
    screen = <MyATSReports onBack={goBack} />;
  } else if (activeFeature === "dashboard") {
    screen = <Dashboard onBack={goBack} />;
  } else if (activeFeature === "login") {
    screen = <Login onBack={goHome} />;
  } else if (activeFeature === "pricing") {
    screen = <Pricing onBack={goBack} />;
  } else {
    screen = <HomeScreen onOpen={openFeature} />;
  }

  return (
    <div className="page-transition">
      <Suspense fallback={<div className="app-loading-state">Loading experience…</div>}>{screen}</Suspense>
    </div>
  );
}
