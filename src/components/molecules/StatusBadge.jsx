import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "info";
      case "review":
        return "warning";
      case "not started":
        return "default";
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;