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
  ArrowLeft,
  Home,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "../lib/axios.js";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const LinkManager = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [drillDownGroup, setDrillDownGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch groups
        const groupsResponse = await axiosInstance.get("/link/fetchGrp");
        setGroups(groupsResponse.data || []);

        // Fetch links
        const linksResponse = await axiosInstance.get("/link/fetchLinks");
        setLinks(linksResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your links and groups",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  const handleAddLink = async (newLink) => {
    try {
      // Update links with the new link data
      setLinks(prevLinks => [...prevLinks, newLink]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding link:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add link",
        variant: "destructive",
      });
    }
  };

  const handleCreateGroup = async (newGroup) => {
    try {
      // Create a temporary link with a unique title for the group
      const tempLink = {
        title: `Group_${Date.now()}`,
        url: "https://group.placeholder",
        description: "Group placeholder",
        group: newGroup,
        isNewGrp: true
      };

      const response = await axiosInstance.post("/link/addLink", tempLink);
      
      // Update groups with the new group data
      setGroups(prevGroups => [...prevGroups, newGroup]);
      
      toast({
        title: "Success",
        description: "Group created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await axiosInstance.delete("/link/deleteLink", {
        data: { linkId }
      });
      setLinks(links.filter((link) => link._id !== linkId));
      toast({
        title: "Success",
        description: "Link deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axiosInstance.delete("/link/deleteLinksByGroup", {
        data: { groupId }
      });
      setGroups(groups.filter((g) => g.id !== groupId));
      setLinks(links.filter(link => link.group?.id !== groupId));
      if (drillDownGroup?.id === groupId) {
        setDrillDownGroup(null);
      }
      toast({
        title: "Success",
        description: "Group deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete group",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-linkify-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleGroupClick = (group) => {
    setDrillDownGroup(group);
    setSearchTerm(""); // Clear search when drilling down
  };

  const handleBackToMainView = () => {
    setDrillDownGroup(null);
    setSelectedGroup("");
    setSearchTerm("");
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup ? (link.group?.name === selectedGroup) : true;

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
        {/* Breadcrumb Navigation */}
        {drillDownGroup && (
          <div className="animate-fade-in">
            <Card className="glass border-white/40 bg-white/95">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToMainView}
                    className="text-slate-600 hover:text-linkify-600 h-8 px-2"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: drillDownGroup.color }}
                    />
                    <FolderOpen className="h-4 w-4" />
                    {drillDownGroup.name}
                  </div>
                  <span className="text-slate-500">
                    (
                    {
                      links.filter((link) => link.group?.name === drillDownGroup.name)
                        .length
                    }{" "}
                    links)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {drillDownGroup ? drillDownGroup.name : "Your Link Dashboard"}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {drillDownGroup
              ? `Manage all links in the ${drillDownGroup.name} group`
              : "Organize, manage, and access all your important links in one beautiful place"}
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
                      <div key={link._id} className="flex items-center gap-2">
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
                      <div key={link._id} className="flex items-center gap-2">
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
          <div key="left-controls" className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Back Button for Drill-down View */}
            {drillDownGroup && (
              <Button
                key="back-button"
                variant="outline"
                onClick={handleBackToMainView}
                className="bg-white/90 border-white/40 text-slate-700 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Groups
              </Button>
            )}

            <div key="search-input" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  drillDownGroup
                    ? `Search in ${drillDownGroup.name}...`
                    : "Search links..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white/90"
              />
            </div>

            {/* Only show group filter in main view */}
            {!drillDownGroup && (
              <div key="group-filter" className="relative">
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
            )}
          </div>

          <div key="right-controls" className="flex gap-3 w-full lg:w-auto">
            {/* View Mode Toggle */}
            <div key="view-toggle" className="flex bg-white/90 rounded-lg p-1 border border-white/40">
              <Button
                key="grid-button"
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`flex-1 ${viewMode === "grid" ? "bg-linkify-500 text-white" : "text-slate-600 hover:bg-white/50"}`}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                key="list-button"
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
              key="add-link-button"
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
            onGroupClick={handleGroupClick}
            viewMode={viewMode}
            drillDownGroup={drillDownGroup}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkManager;
