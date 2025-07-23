import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ClientCard from "@/components/organisms/ClientCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AddClientModal from "@/components/organisms/AddClientModal";
import { clientService } from "@/services/api/clientService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.getAll();
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.company.toLowerCase().includes(query.toLowerCase()) ||
        client.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClients(filtered);
    }
};

  const handleAddClient = async (clientData) => {
    try {
      const newClient = await clientService.create(clientData);
      setClients(prev => [...prev, newClient]);
      setFilteredClients(prev => [...prev, newClient]);
      setShowAddModal(false);
      toast.success("Client added successfully!");
    } catch (err) {
      toast.error("Failed to add client. Please try again.");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Clients
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your client relationships and contacts
          </p>
</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            placeholder="Search clients..."
            onSearch={handleSearch}
            className="w-full sm:w-80"
          />
          <Button
            onClick={() => setShowAddModal(true)}
            className="whitespace-nowrap"
          >
            Add Client
          </Button>
        </div>
      </motion.div>

      {/* Results Info */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600"
        >
          {filteredClients.length === 0 ? (
            `No clients found for "${searchQuery}"`
          ) : (
            `Found ${filteredClients.length} client${filteredClients.length === 1 ? "" : "s"} matching "${searchQuery}"`
          )}
        </motion.div>
      )}

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Empty
          title={searchQuery ? "No clients found" : "No clients yet"}
          description={
            searchQuery
              ? "Try adjusting your search criteria"
              : "Start by adding your first client to get organized"
          }
          icon="Users"
actionLabel="Add Client"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.Id}
              client={client}
              delay={index * 0.1}
            />
          ))}
        </div>
)}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClient}
      />
    </div>
  );
};

export default Clients;