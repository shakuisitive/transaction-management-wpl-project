import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Calendar, CreditCard, PiggyBank, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-50 via-background to-background py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-lime-100/50 via-transparent to-transparent" />
        <div className="max-w-screen-xl mx-auto px-4 relative">
          <div className="flex flex-col items-center text-center gap-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Take Control of Your{" "}
              <span className="text-lime-600">Financial Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track your income and expenses, manage your budget, and make smarter financial decisions with NextCash.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-lime-600 hover:bg-lime-700">
                <Link href="/dashboard/transactions/new">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-lime-200 hover:bg-lime-50">
                <Link href="/dashboard/transactions">
                  View Transactions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-lime-50/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Manage Your Finances
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card hover:border-lime-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Transactions</h3>
              <p className="text-muted-foreground">
                Easily record and categorize your income and expenses with our intuitive interface.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-lime-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monthly Overview</h3>
              <p className="text-muted-foreground">
                Get a clear view of your monthly spending patterns and financial health.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-lime-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your spending habits and track your financial progress over time.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-lime-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                <PiggyBank className="h-6 w-6 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Management</h3>
              <p className="text-muted-foreground">
                Set and track your budget goals to achieve your financial objectives.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-lime-200 transition-colors">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Growth</h3>
              <p className="text-muted-foreground">
                Make informed decisions to grow your wealth and improve your financial standing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-background" />
        <div className="max-w-screen-xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances better with NextCash.
          </p>
          <Button asChild size="lg" className="bg-lime-600 hover:bg-lime-700">
            <Link href="/dashboard/transactions">
              Start Managing Your Finances
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
