import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const AllTools = lazy(() => import("./pages/AllTools").then(m => ({ default: m.AllTools })));
const ToolPage = lazy(() => import("./pages/ToolPage").then(m => ({ default: m.ToolPage })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then(m => ({ default: m.BlogPost })));
const StaticPage = lazy(() => import("./components/StaticPage").then(m => ({ default: m.StaticPage })));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-tools" element={<AllTools />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<StaticPage type="about" onBack={() => {}} />} />
          <Route path="/privacy" element={<StaticPage type="privacy" onBack={() => {}} />} />
          <Route path="/terms" element={<StaticPage type="terms" onBack={() => {}} />} />
          <Route path="/cookies" element={<StaticPage type="cookies" onBack={() => {}} />} />
          <Route path="/contact" element={<StaticPage type="contact" onBack={() => {}} />} />
          <Route path="/support" element={<StaticPage type="support" onBack={() => {}} />} />

          {/* Dynamic Tool Routes */}
          <Route path="/:toolId" element={<ToolPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
