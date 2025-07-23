import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProjectCard from "@/components/organisms/ProjectCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import AddProjectModal from "@/components/organisms/AddProjectModal";
import { projectService } from "@/services/api/projectService";
import { clientService } from "@/services/api/clientService";
const Projects = () => {
const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const statusOptions = [
    { value: "all", label: "All Projects" },
    { value: "not started", label: "Not Started" },
    { value: "in progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "completed", label: "Completed" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, clientsData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setFilteredProjects(projectsData);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getClientById = (clientId) => {
    return clients.find(client => client.Id === clientId);
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project =>
        project.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

const handleAddProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setFilteredProjects(prev => [...prev, newProject]);
      setIsAddModalOpen(false);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      throw error;
    }
  };

  const handleProjectUpdate = async (projectId, updateData) => {
    try {
      const updatedProject = await projectService.update(projectId, updateData);
      if (updatedProject) {
        setProjects(prev => 
          prev.map(p => p.Id === projectId ? updatedProject : p)
        );
        setFilteredProjects(prev => 
          prev.map(p => p.Id === projectId ? updatedProject : p)
        );
        
        // Show completion notification
        if (updateData.status === "Completed") {
          toast.success(`🎉 ${updatedProject.name} has been completed!`);
        } else {
          toast.success("Project updated successfully!");
        }
      }
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, projects]);

  if (loading) {
    return <Loading type="cards" />;
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
            Projects
          </h1>
          <p className="text-gray-600 mt-1">
            Track progress and manage project deliverables
          </p>
        </div>
<div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            placeholder="Search projects..."
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Demo notification trigger - simulate completing a random project
                const activeProjects = filteredProjects.filter(p => p.status !== "Completed");
                if (activeProjects.length > 0) {
                  const randomProject = activeProjects[Math.floor(Math.random() * activeProjects.length)];
                  handleProjectUpdate(randomProject.Id, { 
                    status: "Completed", 
                    progress: 100 
                  });
                }
              }}
              variant="outline"
              className="whitespace-nowrap"
            >
              Demo Complete
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="whitespace-nowrap"
            >
              Add Project
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter(option.value)}
            className="text-sm"
          >
            {option.label}
          </Button>
        ))}
      </motion.div>

      {/* Results Info */}
      {(searchQuery || statusFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600"
        >
          {filteredProjects.length === 0 ? (
            "No projects found with current filters"
          ) : (
            `Showing ${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"}`
          )}
        </motion.div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchQuery || statusFilter !== "all" ? "No projects found" : "No projects yet"}
          description={
            searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first project to start tracking progress"
          }
          icon="Briefcase"
actionLabel="Create Project"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.Id}
              project={project}
              client={getClientById(project.clientId)}
              delay={index * 0.1}
            />
          ))}
        </div>
)}

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
        clients={clients}
      />
    </div>
  );
};

export default Projects;