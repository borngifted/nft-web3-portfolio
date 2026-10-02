import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CinematicIntro from "./pages/CinematicIntro";
import Home from "./pages/Home";
import Manifesto from "./pages/Manifesto";
import Studio from "./pages/Studio";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";
import TheGoodagains from "./pages/TheGoodagains";
import GoodagainsMint from "./pages/GoodagainsMint";
import SmoothScroll from "./components/SmoothScroll";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './lib/web3';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const rainbowKitTheme = darkTheme({
  accentColor: 'oklch(0.8 0.15 195)',
  accentColorForeground: 'oklch(0 0 0)',
  borderRadius: 'none',
  fontStack: 'system',
});

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={CinematicIntro} />
      <Route path={"/noir"} component={Home} />
      <Route path={"/manifesto"} component={Manifesto} />
      <Route path={"/studio"} component={Studio} />
      <Route path={"/journal"} component={Journal} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/the-goodagains"} component={TheGoodagains} />
      <Route path={"/the-goodagains/mint"} component={GoodagainsMint} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowKitTheme}>
            <ThemeProvider defaultTheme="dark">
              <TooltipProvider>
                <Toaster />
                <SmoothScroll />
                <Router />
              </TooltipProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
