import { useState , useEffect} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Brain, Zap } from "lucide-react";

export const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);

  const [emails, setEmails] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
  axios.get("http://localhost:8000/emails")
    .then((res) => {
      const fetchedEmails = res.data;
      setEmails(fetchedEmails);

      // Generate dynamic suggestions
      const senders = [...new Set(fetchedEmails.map((e) => e.from))].slice(0, 3);
      const categories = [...new Set(fetchedEmails.map((e) => e.category))].slice(0, 3);
      const urgents = fetchedEmails.filter(e => e.urgency === "high");
      const positives = fetchedEmails.filter(e => e.sentiment === "positive");
      const cleanedSenders = [
        ...new Set(
          fetchedEmails
            .map((e) => {
              const match = e.from.match(/^(.*?)(<.*?>)?$/); // Extracts "Name" part before <
              return match ? match[1].trim() : e.from;
            })
        )
      ].slice(0, 3);

      const dynamicSuggestions = [
        ...cleanedSenders.map(sender => `emails from ${sender}`),
        ...categories.map(cat => `emails about ${cat}`),
        urgents.length > 0 ? "urgent emails from last week" : null,
        positives.length > 0 ? "positive feedback from customers" : null,
        "meeting invites this month",
      ].filter(Boolean); // remove nulls

      setSuggestedQueries(dynamicSuggestions);
    })
    .catch((err) => console.error("Email fetch failed", err));
}, []);


 const handleSearch = async () => {
  if (!query.trim()) return;

  setIsSearching(true);
  try {
    const response = await axios.post("http://localhost:8000/smart-search", {
      query,
      emails,
    });
    console.log("SMART SEARCH RESPONSE:", response.data);
    setResults(response.data?.results || response.data || []); // Assume backend returns filtered emails
    } catch (err) {
    console.error("Smart search error:", err);
    } finally {
    setIsSearching(false);
    }
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setTimeout(() => {
    handleSearch();
  }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Smart Search</h2>
        </div>
        <p className="text-subtext max-w-2xl mx-auto">
          Use natural language to find exactly what you're looking for. 
          Ask questions like "urgent emails from my boss" or "positive customer feedback this week".
        </p>
      </div>

      {/* Search Input */}
      <Card className="glass-heavy p-6 max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Ask me anything about your emails..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="glass-input pl-10 h-12 text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isSearching ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Suggested Queries */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Try these examples:</h3>
        <div className="flex flex-wrap gap-3">
          {suggestedQueries.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors py-2 px-4 text-sm border-white/20 text-subtext hover:text-foreground"
              onClick={() => handleSuggestedQuery(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Results Placeholder */}
      {isSearching && (
        <Card className="glass-heavy p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="text-lg text-subtext">Analyzing your emails with AI...</div>
          </div>
        </Card>
      )}
      {!isSearching && results.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          {results.map((email, idx) => (
            <Card key={idx} className="glass-heavy p-4">
              <p className="text-sm text-muted-foreground"><strong>From:</strong> {email.from}</p>
              <p className="text-lg font-semibold">{email.subject}</p>
              <p className="text-sm mt-1">{email.snippet}</p>
            </Card>
          ))}
        </div>
      )}

      {/* AI Features Info */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
        <Card className="glass-card p-4 text-center hover-lift">
          <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold text-foreground mb-1">Natural Language</h4>
          <p className="text-sm text-subtext">Search using everyday language</p>
        </Card>
        <Card className="glass-card p-4 text-center hover-lift">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold text-foreground mb-1">AI-Powered</h4>
          <p className="text-sm text-subtext">Powered by advanced AI models</p>
        </Card>
        <Card className="glass-card p-4 text-center hover-lift">
          <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold text-foreground mb-1">Instant Results</h4>
          <p className="text-sm text-subtext">Get relevant emails in seconds</p>
        </Card>
      </div>
    </div>
  );
};