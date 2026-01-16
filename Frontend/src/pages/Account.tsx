
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  User, Mail, LogOut, FileText, Trash2, Edit2, 
  Briefcase, UserPlus, MapPin, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserNotes } from "@/services/notesService";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [noteCount, setNoteCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile States
  const [newName, setNewName] = useState(user?.displayName || "");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Fetch data from Firestore Database
  useEffect(() => {
    if (user) {
      getUserNotes(user.uid).then(notes => setNoteCount(notes.length));
      
      const fetchPersonalDetails = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAge(data.age || "");
          setOccupation(data.occupation || "");
          setLocation(data.location || "");
        }
      };
      fetchPersonalDetails();
    }
  }, [user]);

  // Save changes to Database
  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Update Auth Display Name
      await updateProfile(user, { displayName: newName });
      
      // 2. Update Firestore document
      await setDoc(doc(db, "users", user.uid), {
        displayName: newName,
        age,
        occupation,
        location,
        updatedAt: new Date()
      }, { merge: true });

      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Changes saved to your database." });
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Secure Account Deletion Flow
  const handleDeleteAccount = async () => {
  if (!user) return;

  const confirmFirst = window.confirm("Permanently delete your account? This cannot be undone.");
  if (!confirmFirst) return;

  const finalCheck = window.prompt("Type 'DELETE' to confirm:");
  if (finalCheck !== "DELETE") return;

  try {
    setIsSaving(true);
    const idToken = await user.getIdToken();

    // Call your Flask API
    const response = await fetch('http://localhost:5000/api/delete-account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      toast({ title: "Account Deleted", description: "All data has been removed." });
      // Force logout on the frontend and redirect
      await logout(); 
      navigate("/");
    } else {
      throw new Error(data.error || "Backend deletion failed");
    }
  } catch (error: any) {
    toast({ 
      title: "Error", 
      description: error.message || "Could not delete account.", 
      variant: "destructive" 
    });
  } finally {
    setIsSaving(false);
  }
};

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-12 space-y-8 animate-in fade-in">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold">Account</h1>
          <Button variant="outline" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              {!isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" /> Edit Info</Button>}
            </div>

            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full Name" />
                  <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                  <Input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Occupation" />
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleUpdateProfile} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
                  <p className="text-muted-foreground"><Mail className="inline w-4 h-4 mr-2" /> {user.email}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <p><UserPlus className="inline w-4 h-4 mr-1 text-primary" /> Age: {age || "—"}</p>
                    <p><Briefcase className="inline w-4 h-4 mr-1 text-primary" /> Job: {occupation || "—"}</p>
                    <p><MapPin className="inline w-4 h-4 mr-1 text-primary" /> Loc: {location || "—"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats and Danger Zone */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex gap-2"><FileText className="w-5 h-5" /> Summary</h3>
            <p className="text-sm">Notes Processed: <b>{noteCount}</b></p>
            <p className="text-sm">Joined: <b>{new Date(user.metadata.creationTime!).toLocaleDateString()}</b></p>
          </Card>

          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <h3 className="font-bold text-destructive mb-2 flex gap-2"><Trash2 className="w-5 h-5" /> Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Deleting removes all notes permanently.</p>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isSaving}>Delete Account</Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Account;
