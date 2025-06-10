import React, { useState, useEffect } from "react";
import AddLinkForm from "./AddLinkForm";
import GroupGrid from "./GroupGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Plus,
  Link2,
  BarChart3,
  Search,
  Filter,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  Grid3X3,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Mock data for demonstration
  useEffect(() => {
    const mockGroups = [
      { id: 1, name: "Social Media", color: "#3b82f6" },
      { id: 2, name: "Work", color: "#10b981" },
      { id: 3, name: "Learning", color: "#f59e0b" },
    ];

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const mockLinks = [
      {
        id: 1,
        title: "Instagram Profile",
        url: "https://instagram.com/myprofile",
        description: "My personal Instagram account",
        group: "Social Media",
        createdAt: new Date().toISOString(),
        reminderDate: tomorrow.toISOString(),
        reminderNote: "Check engagement metrics",
      },
      {
        id: 2,
        title: "LinkedIn",
        url: "https://linkedin.com/in/myprofile",
        description: "Professional networking profile",
        group: "Work",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        reminderDate: yesterday.toISOString(),
        reminderNote: "Update profile with new skills",
      },
      {
        id: 3,
        title: "React Documentation",
        url: "https://react.dev",
        description: "Official React documentation",
        group: "Learning",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        reminderDate: nextWeek.toISOString(),
        reminderNote: "Study new React 19 features",
      },
      {
        id: 4,
        title: "Portfolio Website",
        url: "https://myportfolio.com",
        description: "My personal portfolio website",
        group: "",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        reminderDate: lastWeek.toISOString(),
        reminderNote: "Update with latest projects",
      },
    ];

    setGroups(mockGroups);
    setLinks(mockLinks);
  }, []);

  const handleAddLink = (newLink) => {
    setLinks([...links, newLink]);
    setShowAddForm(false);
  };

  const handleCreateGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const handleDeleteLink = (linkId) => {
    setLinks(links.filter((link) => link.id !== linkId));
  };

  const handleDeleteGroup = (groupId) => {
    const groupToDelete = groups.find((g) => g.id === groupId);
    if (groupToDelete) {
      // Move links from deleted group to ungrouped
      setLinks(
        links.map((link) =>
          link.group === groupToDelete.name ? { ...link, group: "" } : link,
        ),
      );
      setGroups(groups.filter((g) => g.id !== groupId));
    }
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup ? link.group === selectedGroup : true;

    return matchesSearch && matchesGroup;
  });

  const filteredGroups = groups.filter((group) =>
    selectedGroup ? group.name === selectedGroup : true,
  );

  const totalLinks = links.length;
  const totalGroups = groups.length;

  // Calculate reminder statistics
  const now = new Date();
  const overdueLinks = links.filter(
    (link) => link.reminderDate && new Date(link.reminderDate) < now,
  );
  const upcomingReminders = links.filter((link) => {
    if (!link.reminderDate) return false;
    const reminderDate = new Date(link.reminderDate);
    const dayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return reminderDate >= now && reminderDate <= dayFromNow;
  });
  const totalReminders = links.filter((link) => link.reminderDate).length;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Your Link Dashboard
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Organize, manage, and access all your important links in one
            beautiful place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <Link2 className="h-8 w-8 mx-auto mb-2 text-linkify-600" />
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {totalLinks}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Total Links
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-ocean-600" />
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {totalGroups}
              </div>
              <div className="text-sm font-medium text-slate-600">Groups</div>
            </CardContent>
          </Card>

          <Card
            className={`glass border-white/40 ${overdueLinks.length > 0 ? "bg-red-50/95 border-red-200/60" : "bg-white/95"}`}
          >
            <CardContent className="p-6 text-center relative">
              {overdueLinks.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  !
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-8 w-8 mx-auto mb-2 ${overdueLinks.length > 0 ? "text-red-600" : "text-orange-600"}`}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <div
                className={`text-2xl font-bold mb-1 ${overdueLinks.length > 0 ? "text-red-800" : "text-slate-800"}`}
              >
                {overdueLinks.length}
              </div>
              <div
                className={`text-sm font-medium ${overdueLinks.length > 0 ? "text-red-700" : "text-slate-600"}`}
              >
                Overdue
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mx-auto mb-2 text-blue-600"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {totalReminders}
              </div>
              <div className="text-sm font-medium text-slate-600">
                With Reminders
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Overdue Reminders Alert */}
        {overdueLinks.length > 0 && (
          <Card className="border-red-200 bg-red-50/95 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    {overdueLinks.length} Overdue Reminder
                    {overdueLinks.length > 1 ? "s" : ""}
                  </h3>
                  <div className="text-xs text-red-700 space-y-1">
                    {overdueLinks.slice(0, 3).map((link) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <span className="font-medium">{link.title}</span>
                        {link.reminderNote && (
                          <span className="text-red-600">
                            - {link.reminderNote}
                          </span>
                        )}
                      </div>
                    ))}
                    {overdueLinks.length > 3 && (
                      <div className="text-red-600 font-medium">
                        +{overdueLinks.length - 3} more overdue
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/95 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">
                    {upcomingReminders.length} Reminder
                    {upcomingReminders.length > 1 ? "s" : ""} Due Soon
                  </h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    {upcomingReminders.map((link) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <span className="font-medium">{link.title}</span>
                        {link.reminderNote && (
                          <span className="text-blue-600">
                            - {link.reminderNote}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white/90"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="pl-10 pr-8 h-11 rounded-lg border border-white/30 bg-white/95 backdrop-blur-sm text-slate-800 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-linkify-500 focus-visible:ring-offset-2 w-full sm:w-48"
              >
                <option value="">All Groups</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-white/90 rounded-lg p-1 border border-white/40">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`flex-1 ${viewMode === "grid" ? "bg-linkify-500 text-white" : "text-slate-600 hover:bg-white/50"}`}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`flex-1 ${viewMode === "list" ? "bg-linkify-500 text-white" : "text-slate-600 hover:bg-white/50"}`}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="gradient"
              size="lg"
              className="flex-1 lg:flex-initial"
            >
              {showAddForm ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <div className="animate-fade-in">
            <AddLinkForm
              onAddLink={handleAddLink}
              onCreateGroup={handleCreateGroup}
              groups={groups}
            />
          </div>
        )}

        {/* Groups and Links Grid */}
        <div className="animate-fade-in">
          <GroupGrid
            groups={filteredGroups}
            links={filteredLinks}
            onDeleteLink={handleDeleteLink}
            onDeleteGroup={handleDeleteGroup}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkManager;
