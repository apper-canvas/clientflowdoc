import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskItem from "@/components/organisms/TaskItem";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import EditTaskModal from "@/components/organisms/EditTaskModal";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

const Tasks = () => {
const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setFilteredTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProjectById = (projectId) => {
    return projects.find(project => project.Id === projectId);
  };

const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      if (updatedTask) {
        setTasks(prev => 
          prev.map(task => 
            task.Id === taskId ? updatedTask : task
          )
        );
        toast.success(completed ? "✅ Task completed!" : "🔄 Task reopened");
      }
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
      console.error("Task update error:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData);
      if (updatedTask) {
        setTasks(prev => 
          prev.map(task => 
            task.Id === taskId ? updatedTask : task
          )
        );
        setIsEditModalOpen(false);
        setEditingTask(null);
        toast.success("✅ Task updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
      console.error("Task update error:", err);
    }
  };
  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task =>
        task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Apply status filter
    if (statusFilter === "pending") {
      filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }

    // Sort by due date and completion status
    filtered.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    setFilteredTasks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    loadData();
  }, []);

useEffect(() => {
    applyFilters();
  }, [searchQuery, priorityFilter, statusFilter, tasks]);

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Stay organized and track your progress
          </p>
        </div>
        <SearchBar
          placeholder="Search tasks..."
          onSearch={handleSearch}
          className="w-full sm:w-64"
        />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(option.value)}
              className="text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant={priorityFilter === option.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPriorityFilter(option.value)}
              className="text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Results Info */}
      {(searchQuery || priorityFilter !== "all" || statusFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between text-sm text-gray-600"
        >
          <span>
            {filteredTasks.length === 0 ? (
              "No tasks found with current filters"
            ) : (
              `Showing ${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}`
            )}
          </span>
          
          {filteredTasks.length > 0 && (
            <span>
              {filteredTasks.filter(t => t.completed).length} completed, {filteredTasks.filter(t => !t.completed).length} pending
            </span>
          )}
        </motion.div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title={searchQuery || priorityFilter !== "all" || statusFilter !== "all" ? "No tasks found" : "No tasks yet"}
          description={
            searchQuery || priorityFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first task to start staying organized"
          }
          icon="CheckSquare"
          actionLabel="Add Task"
          onAction={() => console.log("Add task")}
        />
      ) : (
        <div className="space-y-3">
{filteredTasks.map((task, index) => (
            <TaskItem
              key={task.Id}
              task={task}
              project={getProjectById(task.projectId)}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              delay={index * 0.05}
            />
          ))}
project={getProjectById(task.projectId)}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        task={editingTask}
        projects={projects}
      />
    </div>
  );
};

export default Tasks;