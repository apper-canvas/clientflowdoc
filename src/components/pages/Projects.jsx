import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/organisms/ProjectCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
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
          onAction={() => console.log("Create project")}
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
    </div>
  );
};

export default Projects;