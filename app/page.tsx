"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Flame, CheckCircle2, Clock3, Trash2, Flag, Filter, CalendarDays, Sparkles, ListTodo, BarChart3, Target, MoonStar, SunMedium } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialTasks = [
  {
    id: 1,
    title: "Finish system design notes",
    description: "Polish architecture bullets and prep talking points for review.",
    category: "Work",
    priority: "High",
    due: "Today",
    completed: false,
    tags: ["design", "urgent"],
    estimate: "45 min",
  },
  {
    id: 2,
    title: "Gym - glutes focus",
    description: "Hip thrusts, RDLs, split squats, abduction finisher.",
    category: "Health",
    priority: "Medium",
    due: "Today",
    completed: true,
    tags: ["fitness", "routine"],
    estimate: "60 min",
  },
  {
    id: 3,
    title: "Reply to recruiter",
    description: "Send updated availability and confirm next steps.",
    category: "Career",
    priority: "High",
    due: "Tomorrow",
    completed: false,
    tags: ["email", "follow-up"],
    estimate: "15 min",
  },
  {
    id: 4,
    title: "Meal prep for 3 days",
    description: "Chicken, rice, roasted vegetables, yogurt cups.",
    category: "Personal",
    priority: "Low",
    due: "This Week",
    completed: false,
    tags: ["home", "food"],
    estimate: "90 min",
  },
];

const priorities = {
  High: "bg-red-600/20 text-red-300 border-red-500/30",
  Medium: "bg-red-500/10 text-red-200 border-red-400/20",
  Low: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

const categories = ["All", "Work", "Personal", "Health", "Career"];

export default function AdvancedRedBlackTodoApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("priority");
  const [darkMode, setDarkMode] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Work",
    priority: "Medium",
    due: "Today",
  });

  const filteredTasks = useMemo(() => {
    let list = [...tasks].filter((task) => {
      const matchesQuery =
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase()) ||
        task.tags.join(" ").toLowerCase().includes(query.toLowerCase());

      const matchesTab =
        tab === "all"
          ? true
          : tab === "active"
          ? !task.completed
          : tab === "done"
          ? task.completed
          : task.priority === "High";

      const matchesCategory = category === "All" ? true : task.category === category;
      return matchesQuery && matchesTab && matchesCategory;
    });

    list.sort((a, b) => {
      if (sortBy === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "status") return Number(a.completed) - Number(b.completed);
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [tasks, query, tab, category, sortBy]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;
  const highPriorityCount = tasks.filter((t) => t.priority === "High" && !t.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks((prev) => [
      {
        id: Date.now(),
        ...newTask,
        completed: false,
        tags: [newTask.category.toLowerCase()],
        estimate: newTask.priority === "High" ? "45 min" : "30 min",
      },
      ...prev,
    ]);
    setNewTask({
      title: "",
      description: "",
      category: "Work",
      priority: "Medium",
      due: "Today",
    });
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const themeShell = darkMode
    ? "bg-black text-white"
    : "bg-zinc-100 text-zinc-900";

  const panel = darkMode
    ? "border-red-950 bg-zinc-950/80"
    : "border-zinc-200 bg-white";

  const muted = darkMode ? "text-zinc-400" : "text-zinc-500";

  return (
    <div className={`min-h-screen w-full ${themeShell}`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.28),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-800/50 bg-red-950/40 px-3 py-1 text-sm text-red-200">
                <Sparkles className="h-4 w-4" />
                Elite Task Command Center
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Redline <span className="text-red-500">Tasks</span>
              </h1>
              <p className={`mt-2 max-w-2xl text-sm md:text-base ${muted}`}>
                A polished productivity dashboard with smart filters, performance stats, task planning, and a bold red-black aesthetic.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setDarkMode((v) => !v)}
              className="border-red-800 bg-transparent hover:bg-red-950/40"
            >
              {darkMode ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
              Toggle Theme
            </Button>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Total Tasks", value: tasks.length, icon: ListTodo },
                  { label: "Completed", value: completedCount, icon: CheckCircle2 },
                  { label: "Active", value: activeCount, icon: Clock3 },
                  { label: "High Priority", value: highPriorityCount, icon: Flame },
                ].map((item, idx) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card className={`${panel} border shadow-2xl shadow-red-950/10`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm ${muted}`}>{item.label}</p>
                            <p className="mt-2 text-3xl font-bold">{item.value}</p>
                          </div>
                          <div className="rounded-2xl border border-red-700/30 bg-red-600/10 p-3 text-red-400">
                            <item.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className={`${panel} border shadow-xl`}>
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white font-bold tracking-wide drop-shadow-[0_0_6px_rgba(255,0,0,0.6)]">Task Workspace</CardTitle>
                      <CardDescription className={muted}>Search, filter, sort, and manage everything in one place.</CardDescription>
                    </div>
                    <Tabs value={tab} onValueChange={setTab}>
                      <TabsList className="grid w-full grid-cols-4 bg-zinc-900 text-zinc-300 lg:w-[420px]">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="done">Done</TabsTrigger>
                        <TabsTrigger value="focus">Focus</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, description, or tags..."
                        className="border-red-950 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="border-red-950 bg-zinc-900 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-red-950 bg-zinc-900 text-white">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Sort: Priority</SelectItem>
                        <SelectItem value="status">Sort: Status</SelectItem>
                        <SelectItem value="alphabetical">Sort: A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-3xl border p-4 transition-all ${
                          darkMode
                            ? "border-zinc-900 bg-gradient-to-r from-zinc-950 to-black hover:border-red-900/60"
                            : "border-zinc-200 bg-white"
                        } ${task.completed ? "opacity-70" : "opacity-100"}`}
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            <div className="pt-1">
                              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className={`text-lg font-semibold text-white ${task.completed ? "line-through text-zinc-500" : "drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"}`}>{task.title}</h3>
                                <Badge className={priorities[task.priority]}>{task.priority}</Badge>
                                <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                                  {task.category}
                                </Badge>
                              </div>
                              <p className={`mt-2 text-sm ${muted}`}>{task.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                {task.tags.map((tag) => (
                                  <span key={tag} className="rounded-full border border-red-900/40 bg-red-950/30 px-2.5 py-1 text-red-200">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                            <Badge variant="outline" className="gap-1 border-zinc-700 text-zinc-300">
                              <CalendarDays className="h-3.5 w-3.5" /> {task.due}
                            </Badge>
                            <Badge variant="outline" className="gap-1 border-zinc-700 text-zinc-300">
                              <Clock3 className="h-3.5 w-3.5" /> {task.estimate}
                            </Badge>
                            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="hover:bg-red-950/40 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {filteredTasks.length === 0 && (
                      <div className="rounded-3xl border border-dashed border-red-950 bg-zinc-950/40 p-10 text-center text-zinc-400">
                        No tasks match your filters.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className={`${panel} border shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white font-bold">
                    <Plus className="h-5 w-5 text-red-500" />
                    Quick Create
                  </CardTitle>
                  <CardDescription className={muted}>Add a new task with category, priority, and due timing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="border-red-950 bg-zinc-900 text-white placeholder:text-zinc-500"
                  />
                  <Input
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="border-red-950 bg-zinc-900 text-white placeholder:text-zinc-500"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                      <SelectTrigger className="border-red-950 bg-zinc-900 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>

                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger className="border-red-950 bg-zinc-900 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={newTask.due} onValueChange={(value) => setNewTask({ ...newTask, due: value })}>
                      <SelectTrigger className="border-red-950 bg-zinc-900 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Today">Today</SelectItem>
                        <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="This Week">This Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={addTask} className="w-full bg-red-600 text-white hover:bg-red-500">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </CardContent>
              </Card>

              <Card className={`${panel} border shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white font-bold">
                    <Target className="h-5 w-5 text-red-500" />
                    Progress Pulse
                  </CardTitle>
                  <CardDescription className={muted}>Track your momentum at a glance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className={muted}>Completion Rate</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-zinc-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-red-950 bg-red-950/20 p-4">
                      <p className={`text-xs uppercase tracking-wide ${muted}`}>Main Focus</p>
                      <p className="mt-2 font-semibold text-white">High-impact tasks first</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                      <p className={`text-xs uppercase tracking-wide ${muted}`}>Next Win</p>
                      <p className="mt-2 font-semibold text-white">Clear 2 active items today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${panel} border shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white font-bold">
                    <BarChart3 className="h-5 w-5 text-red-500" />
                    Productivity Insights
                  </CardTitle>
                  <CardDescription className={muted}>A stylish breakdown of what needs attention.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "High Priority Load", value: Math.min(highPriorityCount * 25, 100), icon: Flag },
                    { label: "Tasks In Motion", value: Math.min(activeCount * 20, 100), icon: Filter },
                    { label: "Execution Streak", value: Math.max(progress, 18), icon: Flame },
                  ].map((row) => (
                    <div key={row.label} className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <row.icon className="h-4 w-4 text-red-400" />
                          <span className="font-medium text-white">{row.label}</span>
                        </div>
                        <span className={`text-sm ${muted}`}>{row.value}%</span>
                      </div>
                      <Progress value={row.value} className="h-2.5 bg-zinc-900" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
