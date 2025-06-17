import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Calendar,
  Trash2,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle2,
} from "lucide-react";

const LinkCard = ({ link, onDelete, viewMode = "grid" }) => {
  const handleVisit = () => {
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  // console.log("LinkCard render - Link ID:", link._id, "Reminder Date:", link.reminderDate, "Calendar Event ID:", link.calendarEventId);

  const getReminderStatus = () => {
    if (!link.reminderDate) return null;

    const now = new Date();
    const reminderDate = new Date(link.reminderDate);

    if (reminderDate < now) {
      return { type: "overdue", label: "Overdue", color: "red" };
    }

    const dayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (reminderDate <= dayFromNow) {
      return { type: "due-soon", label: "Due Soon", color: "orange" };
    }

    return { type: "upcoming", label: "Scheduled", color: "blue" };
  };

  const reminderStatus = getReminderStatus();

  if (viewMode === "list") {
    return (
      <Card
        className={`group relative overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-300 backdrop-blur-lg ${
          reminderStatus?.type === "overdue"
            ? "border-red-300 bg-red-50/95"
            : reminderStatus?.type === "due-soon"
              ? "border-orange-300 bg-orange-50/95"
              : "border-white/40 bg-white/95"
        }`}
      >
        <div className="bg-gradient-to-r from-linkify-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Reminder Status Badge for List View */}
        {reminderStatus && (
          <div
            className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              reminderStatus.type === "overdue"
                ? "bg-red-100 text-red-700 border border-red-200"
                : reminderStatus.type === "due-soon"
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            {reminderStatus.type === "overdue" ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {reminderStatus.label}
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg font-semibold line-clamp-1 text-slate-800 group-hover:text-linkify-700 transition-colors pr-20">
                  {link.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(link._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 h-8 w-8 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Description and URL */}
                <div className="md:col-span-2 space-y-2">
                  {link.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                  <div className="text-xs text-slate-500 truncate bg-slate-100 px-2 py-1 rounded max-w-md">
                    {link.url}
                  </div>
                </div>

                {/* Metadata and Actions */}
                <div className="space-y-3">
                  {/* Reminder Info */}
                  {link.reminderDate && (
                    <div
                      className={`text-xs flex items-center gap-1 p-2 rounded-md ${
                        reminderStatus?.type === "overdue"
                          ? "bg-red-100 text-red-700"
                          : reminderStatus?.type === "due-soon"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Bell className="h-3 w-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {formatDateTime(link.reminderDate)}
                        </div>
                        {link.reminderNote && (
                          <div className="opacity-80 truncate">
                            {link.reminderNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Group and Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-linkify-700 font-medium bg-linkify-100 px-2 py-1 rounded-full">
                      {link.group && link.group.name ? link.group.name : "Ungrouped"}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(link.createdAt)}
                    </div>
                  </div>

                  {/* Calendar Sync Status */}
                  {link.reminderDate && (
                    <div className="flex items-center gap-1 text-xs mt-2">
                      {link.calendarEventId ? (
                        <div className="text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Added to Calendar</span>
                        </div>
                      ) : (
                        <div className="text-slate-500 bg-slate-50 px-2 py-1 rounded-full flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Calendar Sync Pending</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visit Button */}
                  <Button
                    onClick={handleVisit}
                    variant="gradient"
                    size="sm"
                    className="w-full"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Visit Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (original design)
  return (
    <Card
      className={`group relative overflow-hidden animate-fade-in hover:shadow-2xl transition-all duration-300 backdrop-blur-lg ${
        reminderStatus?.type === "overdue"
          ? "border-red-300 bg-red-50/95"
          : reminderStatus?.type === "due-soon"
            ? "border-orange-300 bg-orange-50/95"
            : "border-white/40 bg-white/95"
      }`}
    >
      <div className="bg-gradient-to-br from-linkify-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Reminder Status Badge */}
      {reminderStatus && (
        <div
          className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            reminderStatus.type === "overdue"
              ? "bg-red-100 text-red-700 border border-red-200"
              : reminderStatus.type === "due-soon"
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {reminderStatus.type === "overdue" ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {reminderStatus.label}
        </div>
      )}

      {/* Add Calendar Integration Status */}
      {link.reminderDate && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          {link.calendarEventId ? (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              <span>Added to Calendar</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              <span>Calendar Sync Pending</span>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-slate-800 group-hover:text-linkify-700 transition-colors">
            {link.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(link._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {link.description && (
          <p className="text-sm text-slate-600 line-clamp-2 mt-2">
            {link.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(link.createdAt)}
          </div>

          {/* Reminder Information */}
          {link.reminderDate && (
            <div
              className={`text-xs flex items-center gap-1 p-2 rounded-md ${
                reminderStatus?.type === "overdue"
                  ? "bg-red-100 text-red-700"
                  : reminderStatus?.type === "due-soon"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              <Bell className="h-3 w-3" />
              <div>
                <div className="font-medium">
                  {formatDateTime(link.reminderDate)}
                </div>
                {link.reminderNote && (
                  <div className="opacity-80 mt-1">{link.reminderNote}</div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-linkify-700 font-medium bg-linkify-100 px-2 py-1 rounded-full">
              {link.group && link.group.name ? link.group.name : "Ungrouped"}
            </div>

            <Button
              onClick={handleVisit}
              variant="gradient"
              size="sm"
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </Button>
          </div>

          <div className="text-xs text-slate-500 truncate bg-slate-100 px-2 py-1 rounded">
            {link.url}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
