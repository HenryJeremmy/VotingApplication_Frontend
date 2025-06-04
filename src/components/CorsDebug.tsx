
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

const CorsDebug: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const updateApiUrl = () => {
    // Update the API_BASE_URL in localStorage
    localStorage.setItem('API_BASE_URL', apiUrl);
    toast.success('API URL updated. Please refresh the page to apply changes.');
    checkApiConnection();
  };
  
  const checkApiConnection = async () => {
    setConnectionStatus('checking');
    setErrorMessage(null);
    
    try {
      // Try to connect to the API health endpoint
      await axios.get(`${apiUrl}/actuator/health`, { timeout: 5000 });
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          setErrorMessage('Cannot connect to the server. Is the backend running?');
        } else if (error.response) {
          setErrorMessage(`Server responded with status ${error.response.status}`);
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };
  
  // Check connection on component mount
  useEffect(() => {
    const storedApiUrl = localStorage.getItem('API_BASE_URL');
    if (storedApiUrl) {
      setApiUrl(storedApiUrl);
    }
    
    checkApiConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          API Connection Settings
          {connectionStatus === 'checking' && (
            <Badge variant="outline" className="ml-2 bg-yellow-100">Checking...</Badge>
          )}
          {connectionStatus === 'connected' && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">Connected</Badge>
          )}
          {connectionStatus === 'error' && (
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">Error</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">Spring Boot API URL</Label>
            <Input
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080/api"
            />
            <p className="text-xs text-gray-500">
              Enter the URL of your Spring Boot API endpoint
            </p>
            {errorMessage && (
              <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={updateApiUrl} className="flex-1">
              Update API URL
            </Button>
            <Button onClick={checkApiConnection} variant="outline" className="flex-1">
              Test Connection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorsDebug;
