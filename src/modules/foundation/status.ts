export async function getFoundationStatus() {
  return [
    {
      label: "Project Shell",
      description: "Next.js app scaffold is ready for Phase 1 module buildout."
    },
    {
      label: "Supabase",
      description: "SQL-first migrations and generated TypeScript types are the database path."
    },
    {
      label: "Module Boundaries",
      description: "Foundation services are separated from ERP business modules."
    },
    {
      label: "Next Step",
      description: "Build the database foundation: users, roles, permissions, audit, settings, brands, and sequences."
    }
  ];
}
