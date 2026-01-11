'use client';

import { Header } from '@/components/header';
import { emergencyContacts as defaultContacts } from '@/lib/data';
import type { EmergencyContact } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Phone } from 'lucide-react';

export default function EmergencyContactsPage() {
  const [customContacts, setCustomContacts] = useState<EmergencyContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  useEffect(() => {
    const storedContacts = localStorage.getItem('alertnet-custom-contacts');
    if (storedContacts) {
      setCustomContacts(JSON.parse(storedContacts));
    }
  }, []);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactName.trim() && newContactPhone.trim()) {
      const newContact: EmergencyContact = {
        id: String(Date.now()),
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
        isCustom: true,
      };
      const updatedContacts = [...customContacts, newContact];
      setCustomContacts(updatedContacts);
      localStorage.setItem('alertnet-custom-contacts', JSON.stringify(updatedContacts));
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const handleDeleteContact = (id: string) => {
    const updatedContacts = customContacts.filter(c => c.id !== id);
    setCustomContacts(updatedContacts);
    localStorage.setItem('alertnet-custom-contacts', JSON.stringify(updatedContacts));
  };
  
  const allContacts = [...defaultContacts, ...customContacts];

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header title="Emergency Contacts" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Add Custom Contact</CardTitle>
                    <CardDescription>Add personal contacts for quick access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddContact} className="space-y-4">
                        <Input 
                            placeholder="Contact Name (e.g., Family Doctor)" 
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                        />
                        <Input 
                            type="tel"
                            placeholder="Phone Number" 
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                        />
                        <Button type="submit" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Contact
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Contact List</CardTitle>
                    <CardDescription>Your saved list of important numbers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {allContacts.map(contact => (
                            <li key={contact.id} className="flex items-center justify-between rounded-md border p-4">
                                <div className="flex items-center gap-4">
                                  <Phone className="h-5 w-5 text-primary" />
                                  <div>
                                      <p className="font-semibold">{contact.name}</p>
                                      <p className="text-muted-foreground">{contact.phone}</p>
                                  </div>
                                </div>
                                {contact.isCustom && (
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
