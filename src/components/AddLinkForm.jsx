import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Link2, FolderPlus, Tag } from "lucide-react";

const AddLinkForm = ({ onAddLink, onCreateGroup, groups = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    group: "",
    newGroup: "",
  });

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    const linkData = {
      id: Date.now(),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      group: isCreatingGroup ? formData.newGroup : formData.group,
      createdAt: new Date().toISOString(),
    };

    onAddLink(linkData);

    if (isCreatingGroup && formData.newGroup) {
      onCreateGroup({
        id: Date.now(),
        name: formData.newGroup,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      });
    }

    setFormData({
      title: "",
      url: "",
      description: "",
      group: "",
      newGroup: "",
    });
    setIsCreatingGroup(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl bg-gradient-to-r from-linkify-600 to-linkify-800 bg-clip-text text-transparent">
          <Plus className="h-6 w-6 text-linkify-600" />
          Add New Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Link Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., My Portfolio"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold">
                URL *
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Brief description of your link"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-semibold">Group</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                className="text-xs"
              >
                {isCreatingGroup ? (
                  <>
                    <Tag className="h-3 w-3 mr-1" />
                    Select Existing
                  </>
                ) : (
                  <>
                    <FolderPlus className="h-3 w-3 mr-1" />
                    Create New
                  </>
                )}
              </Button>
            </div>

            {isCreatingGroup ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter new group name"
                  value={formData.newGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, newGroup: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={formData.group}
                  onChange={(e) =>
                    setFormData({ ...formData, group: e.target.value })
                  }
                  className="w-full h-11 rounded-lg border border-white/30 bg-white/95 backdrop-blur-sm px-4 py-2 text-slate-800 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-linkify-500 focus-visible:ring-offset-2"
                >
                  <option value="">Select a group (optional)</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!formData.title || !formData.url}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLinkForm;
