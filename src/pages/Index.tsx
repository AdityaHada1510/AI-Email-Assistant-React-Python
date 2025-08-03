import { useState , useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailCard } from "@/components/EmailCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SmartSearch } from "@/components/SmartSearch";
import { InsightsTab } from "@/components/InsightsTab";
import { Search, Mail, Brain, BarChart3, Settings } from "lucide-react";
import backgroundImage from "@/assets/fantasy-background.jpg";


export interface EmailType {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string; // ISO date string
  urgency: string; // e.g., "high", "medium", "low"
  sentiment: string; // e.g., "positive", "neutral", "negative"
  category: string; // e.g., "work", "personal", etc.
  isRead: boolean;
  isStarred: boolean;
}
const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const [emails, setEmails] = useState<EmailType[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailType[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/emails")
      .then((res) => {
        // Map raw Gmail emails into your EmailCard-friendly format
        const mappedEmails = res.data.map((email: any, index: number) => ({
          id: email.id,
          sender: email.from,
          subject: email.subject,
          preview: email.snippet,
          timestamp: email.date,  
          urgency: email.urgency as "high" | "medium" | "low",
          sentiment: email.sentiment as "positive" | "negative" | "neutral", 
          category: email.category,      
          isRead: false,
          isStarred: email.is_starred,
        }));
        setEmails(mappedEmails);
        setFilteredEmails(mappedEmails); // Initialize filtered emails with all emails
      })
      .catch((err) => console.error("Failed to fetch emails:", err));
  }, []);

  console.log("Emails being passed to FilterSidebar:", emails);

  const handleFilterChange = (filters) => {
  const { dateRange, urgency, sentiment, category } = filters;

  const filtered = emails.filter((email) => {
    const emailDate = new Date(email.timestamp);

    const inDateRange = dateRange?.from && dateRange?.to
      ? emailDate >= new Date(dateRange.from) && emailDate <= new Date(dateRange.to)
      : true;

    const urgencyMatch = urgency ? email.urgency === urgency : true;
    const sentimentMatch = sentiment ? email.sentiment === sentiment : true;
    const categoryMatch = category ? email.category === category : true;

    return inDateRange && urgencyMatch && sentimentMatch && categoryMatch;
  });

  setFilteredEmails(filtered);
};

  const toggleStar = (id: string) => {
  setEmails((prevEmails) =>
    prevEmails.map((email) =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    )
  );

  setFilteredEmails((prevEmails) =>
    prevEmails.map((email) =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    )
  );
};


  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(/lovable-uploads/81f7e427-94a0-4fe4-b7f0-cd1ec8228b2f.png)` }}
    >
      {/* Overlay for better text readability */}
      <div className="min-h-screen bg-background/60 backdrop-blur-sm">
        <div className="flex">
          {/* Sidebar */}
          <FilterSidebar onFilterChange={handleFilterChange} emails={emails}/>
          
          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">
                    Email Insights AI
                  </h1>
                  <p className="text-subtext text-lg">
                    Intelligently manage and understand your inbox with AI-powered insights
                  </p>
                </div>
                <Button variant="outline" size="icon" className="glass-input">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Search
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Quick search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input pl-10"
                  />
                </div>
              </div> */}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="emails" className="space-y-6">
              <TabsList className="glass-heavy h-12 p-1">
                <TabsTrigger value="emails" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  All Emails
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Smart Search
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              {/* All Emails Tab */}
              <TabsContent value="emails" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Your Emails ({emails.length})
                  </h2>
                </div>
                
                  <div className="space-y-4">
                    {filteredEmails.map((email) => (
                      <EmailCard 
                      key={email.id} {...email}
                      id={email.id} 
                      urgency={email.urgency as "high" | "medium" | "low"}
                      sentiment={email.sentiment as "positive" | "negative" | "neutral"}
                      onToggleStar={toggleStar}/>
                    ))}
                  </div>
              </TabsContent>  

              {/* Smart Search Tab */}
              <TabsContent value="search">
                <SmartSearch />
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights">
                <InsightsTab emails={emails} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
