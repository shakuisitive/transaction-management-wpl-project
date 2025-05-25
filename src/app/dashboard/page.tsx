import Link from "next/link";
function DashboardPage() {
  return (
    <div>
      <Link href="dashboard/transactions/new">Create A New Transaction</Link>
    </div>
  );
}

export default DashboardPage;
