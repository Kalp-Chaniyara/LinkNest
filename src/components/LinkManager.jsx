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
} from "lucide-react";
import { Input } from "@/components/ui/input";

const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockGroups = [
      { id: 1, name: "Social Media", color: "#3b82f6" },
      { id: 2, name: "Work", color: "#10b981" },
      { id: 3, name: "Learning", color: "#f59e0b" },
    ];

    const mockLinks = [
      {
        id: 1,
        title: "Instagram Profile",
        url: "https://instagram.com/myprofile",
        description: "My personal Instagram account",
        group: "Social Media",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "LinkedIn",
        url: "https://linkedin.com/in/myprofile",
        description: "Professional networking profile",
        group: "Work",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        title: "React Documentation",
        url: "https://react.dev",
        description: "Official React documentation",
        group: "Learning",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 4,
        title: "Portfolio Website",
        url: "https://myportfolio.com",
        description: "My personal portfolio website",
        group: "",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
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

  return (
    <div className="min-h-screen bg-gradient-linkify p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Linkify
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Organize, manage, and access all your important links in one
            beautiful place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <Link2 className="h-10 w-10 mx-auto mb-3 text-linkify-600" />
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {totalLinks}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Total Links
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-10 w-10 mx-auto mb-3 text-ocean-600" />
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {totalGroups}
              </div>
              <div className="text-sm font-medium text-slate-600">Groups</div>
            </CardContent>
          </Card>

          <Card className="glass border-white/40 bg-white/95">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-10 w-10 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {totalGroups > 0 ? Math.round(totalLinks / totalGroups) : 0}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Avg per Group
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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

          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="gradient"
            size="lg"
            className="w-full md:w-auto"
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
          />
        </div>
      </div>
    </div>
  );
};

export default LinkManager;
