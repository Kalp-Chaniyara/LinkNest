import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Link2,
  FolderOpen,
  Clock,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Check,
  Users,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Link2 className="h-8 w-8 text-linkify-600" />,
      title: "Smart Link Organization",
      description:
        "Save and organize all your important links in one beautiful, intuitive interface.",
    },
    {
      icon: <FolderOpen className="h-8 w-8 text-blue-600" />,
      title: "Custom Groups",
      description:
        "Create custom groups to categorize your links by project, topic, or any system you prefer.",
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Smart Reminders",
      description:
        "Set reminders for important links and never miss a deadline or forget to check something.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Usage Analytics",
      description:
        "Track your link usage patterns and optimize your workflow with detailed insights.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure & Private",
      description:
        "Your links are stored securely with enterprise-grade encryption and privacy protection.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Lightning Fast",
      description:
        "Access your links instantly with our optimized search and quick-access features.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content:
        "Linkify has revolutionized how I manage my research links. The reminder feature is a game-changer!",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Developer",
      content:
        "Finally, a link manager that actually understands how developers work. Clean, fast, and powerful.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Content Creator",
      content:
        "The group organization feature helps me keep all my content resources perfectly organized.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Links Managed" },
    { number: "99.9%", label: "Uptime" },
    { number: "50ms", label: "Average Load Time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-linkify">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">Linkify</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/signup")}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6">
              Organize Your Digital Life
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              The ultimate link management platform that helps you save,
              organize, and never lose track of your important links again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                size="lg"
                className="bg-white text-linkify-600 border-white hover:bg-white/90 text-lg px-8 py-3"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass border-white/30 bg-white/20 text-center"
              >
                <CardContent className="p-6">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm md:text-base">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Powerful features designed to make link management effortless and
              efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass border-white/30 bg-white/95 hover:bg-white transform hover:scale-105 transition-all duration-300"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-slate-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              See what our users are saying about Linkify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass border-white/30 bg-white/95">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass border-white/30 bg-white/20">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Organized?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already transformed their
                digital workflow with Linkify.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  size="lg"
                  className="bg-white text-linkify-600 border-white hover:bg-white/90 text-lg px-8 py-3"
                >
                  Start Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                No credit card required • Free forever plan available
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Linkify</h3>
            <p className="text-white/70 mb-4">
              The ultimate link management platform for modern professionals.
            </p>
            <div className="flex justify-center space-x-6">
              <button className="text-white/70 hover:text-white text-sm">
                Privacy Policy
              </button>
              <button className="text-white/70 hover:text-white text-sm">
                Terms of Service
              </button>
              <button className="text-white/70 hover:text-white text-sm">
                Contact
              </button>
            </div>
            <p className="text-white/50 text-xs mt-4">
              © 2024 Linkify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
