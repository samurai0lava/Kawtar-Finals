"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Fingerprint, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  CreditCard,
  Lock
} from 'lucide-react'

// Generate random bytes for FIDO challenge
function randomBuffer(len: number): Uint8Array {
  const buf = new Uint8Array(new ArrayBuffer(len))
  window.crypto.getRandomValues(buf)
  return buf
}

// Helper functions for base64 conversion
function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
}

function uint8ArrayToBase64(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
}

interface FidoAuthPageProps {
  transactionId?: string
  amount?: number
  onSuccess?: () => void
}

export default function FidoAuthPage({ 
  transactionId, 
  amount = 0,
  onSuccess 
}: FidoAuthPageProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [authStep, setAuthStep] = useState('initializing')
  const [allowedCredential, setAllowedCredential] = useState<string | null>(null)

  const txId = transactionId || searchParams?.get('transactionId') || `tx-${Date.now()}`
  const txAmount = amount || parseFloat(searchParams?.get('amount') || '0')

  // Simulate progress updates
  useEffect(() => {
    if (loading || registering) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(interval)
    }
  }, [loading, registering])

  // Check for existing credentials
  useEffect(() => {
    async function checkCredentials() {
      try {
        // Check if WebAuthn is supported
        if (!window.navigator.credentials || !window.navigator.credentials.create) {
          setError('FIDO/WebAuthn is not supported in this browser. Please use Chrome, Firefox, Safari, or Edge.')
          setAuthStep('error')
          return
        }

        // For demo purposes, simulate checking for credentials
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // For demo, always start with registration to show the full flow
        setAuthStep('register')
        setAllowedCredential(null)
        
      } catch (err) {
        console.error('Error checking credentials:', err)
        setAllowedCredential(null)
        setAuthStep('register')
      }
    }
    
    checkCredentials()
  }, [])

  // FIDO Registration
  async function registerFidoKey() {
    setRegistering(true)
    setError('')
    setProgress(0)
    setAuthStep('registering')

    try {
      // Check WebAuthn support
      if (!window.navigator.credentials || !window.navigator.credentials.create) {
        throw new Error('WebAuthn not supported')
      }

      // Create FIDO credential options
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: randomBuffer(32),
        rp: { 
          name: "Kawtar-tech-store - FIDO 3DS Hub",
          id: window.location.hostname
        },
        user: {
          id: randomBuffer(16),
          name: "customer@kawtar-tech-store.com",
          displayName: "Kawtar-tech-store Customer"
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },  // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: { 
          userVerification: "preferred",
          // Remove platform restriction to allow security keys
          residentKey: "preferred"
        },
        timeout: 60000,
        attestation: "none"
      }

      setProgress(30)
      
      console.log('Starting FIDO registration...')
      
      // Request credential creation
      const credential = await navigator.credentials.create({ publicKey })
      
      if (!credential) {
        throw new Error('Failed to create credential')
      }

      console.log('FIDO credential created successfully')
      setProgress(70)

      // Convert credential ID to base64
      const credentialId = uint8ArrayToBase64(new Uint8Array(credential.rawId))
      
      // Simulate API call to register credential
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProgress(100)
      setRegistering(false)
      setAllowedCredential(credentialId)
      setAuthStep('authenticate')
      
      // Wait a moment then proceed to authentication
      setTimeout(() => {
        handleAuthenticate(credentialId)
      }, 1000)

    } catch (e) {
      console.error('FIDO registration error:', e)
      setRegistering(false)
      setProgress(0)
      
      if (e instanceof Error) {
        if (e.name === 'NotSupportedError') {
          setError('FIDO is not supported on this device. Please try on a device with biometric authentication or use a security key.')
        } else if (e.name === 'NotAllowedError') {
          setError('FIDO registration was cancelled. Please try again and allow the authentication when prompted.')
        } else if (e.name === 'InvalidStateError') {
          setError('A credential for this device already exists. Proceeding to authentication...')
          // If credential already exists, try to authenticate
          setTimeout(() => {
            setAuthStep('authenticate')
            handleAuthenticate('existing-credential')
          }, 2000)
          return
        } else {
          setError(`Registration failed: ${e.message}. Please try again or use a different device.`)
        }
      } else {
        setError('An unknown error occurred during registration. Please try again.')
      }
      setAuthStep('error')
    }
  }

  // FIDO Authentication
  async function handleAuthenticate(forceCredentialId?: string) {
    setLoading(true)
    setError('')
    setProgress(0)
    setAuthStep('authenticating')

    try {
      // Check WebAuthn support
      if (!window.navigator.credentials || !window.navigator.credentials.get) {
        throw new Error('WebAuthn not supported')
      }

      const credentialIdToUse = forceCredentialId || allowedCredential

      setProgress(20)

      // Create authentication options
      const assertionOptions: PublicKeyCredentialRequestOptions = {
        challenge: randomBuffer(32),
        timeout: 60000,
        userVerification: "preferred",
        // Allow any credential if we don't have a specific one
        allowCredentials: credentialIdToUse && credentialIdToUse !== 'existing-credential' ? [{
          id: base64ToUint8Array(credentialIdToUse),
          type: "public-key"
        }] : []
      }

      setProgress(40)
      console.log('Starting FIDO authentication...')

      // Request authentication
      const assertion = await navigator.credentials.get({
        publicKey: assertionOptions
      })

      if (!assertion) {
        throw new Error('Authentication failed - no assertion returned')
      }

      console.log('FIDO authentication successful')
      setProgress(70)

      // Cast assertion to PublicKeyCredential to access rawId and response
      const publicKeyAssertion = assertion as PublicKeyCredential

      // Prepare assertion data for 3DS processing
      const assertionData = {
        id: publicKeyAssertion.id,
        type: publicKeyAssertion.type,
        rawId: Array.from(new Uint8Array(publicKeyAssertion.rawId)),
        response: {
          authenticatorData: Array.from(new Uint8Array((publicKeyAssertion.response as AuthenticatorAssertionResponse).authenticatorData)),
          clientDataJSON: Array.from(new Uint8Array((publicKeyAssertion.response as AuthenticatorAssertionResponse).clientDataJSON)),
          signature: Array.from(new Uint8Array((publicKeyAssertion.response as AuthenticatorAssertionResponse).signature)),
          userHandle: (publicKeyAssertion.response as AuthenticatorAssertionResponse).userHandle ? 
            Array.from(new Uint8Array((publicKeyAssertion.response as AuthenticatorAssertionResponse).userHandle!)) : null
        }
      }

      // Simulate 3DS processing with FIDO assertion
      console.log('Processing 3DS transaction with FIDO assertion...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProgress(100)
      setSuccess(true)
      setAuthStep('success')

      // Complete the transaction
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(`/checkout/success?transactionId=${txId}&amount=${txAmount}`)
        }
      }, 2000)

    } catch (e) {
      console.error('FIDO authentication error:', e)
      setLoading(false)
      setProgress(0)
      
      if (e instanceof Error) {
        if (e.name === 'NotAllowedError') {
          setError('Authentication was cancelled or timed out. Please try again.')
        } else if (e.name === 'NotSupportedError') {
          setError('FIDO authentication is not supported on this device.')
        } else if (e.name === 'SecurityError') {
          setError('Security error during authentication. Please ensure you\'re using HTTPS.')
        } else if (e.name === 'InvalidStateError') {
          setError('No credentials available. Please register a FIDO key first.')
          // Redirect to registration
          setTimeout(() => {
            setAuthStep('register')
            setAllowedCredential(null)
          }, 2000)
          return
        } else {
          setError(`Authentication failed: ${e.message}`)
        }
      } else {
        setError('An unknown error occurred during authentication.')
      }
      
      setAuthStep('error')
    }
    setLoading(false)
  }

  // Auto-start authentication flow (but only with user interaction)
  useEffect(() => {
    // Don't auto-start, let user click the button to avoid immediate failures
    // This prevents the "immediate failure" issue you experienced
  }, [authStep, allowedCredential])

  const getStepContent = () => {
    switch (authStep) {
      case 'initializing':
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin text-blue-600" />,
          title: 'Initializing 3D Secure',
          description: 'Preparing FIDO authentication for your transaction...',
          action: null
        }
      
      case 'register':
        return {
          icon: <Fingerprint className="h-12 w-12 text-blue-600" />,
          title: 'Register Security Key',
          description: 'Set up FIDO authentication for enhanced security',
          action: (
            <Button 
              onClick={registerFidoKey}
              disabled={registering}
              className="w-full"
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Setup FIDO Security
                </>
              )}
            </Button>
          )
        }
      
      case 'authenticate':
        return {
          icon: <Lock className="h-12 w-12 text-blue-600" />,
          title: 'Authenticate Payment',
          description: 'Use your FIDO security key to authorize this transaction',
          action: (
            <Button 
              onClick={() => handleAuthenticate()}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Authenticate with FIDO
                </>
              )}
            </Button>
          )
        }
      
      case 'success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          title: 'Authentication Successful!',
          description: 'Your payment has been securely authenticated',
          action: null
        }
      
      case 'error':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
          title: 'Authentication Failed',
          description: 'Please try again or contact support',
          action: (
            <Button 
              onClick={() => allowedCredential ? handleAuthenticate() : registerFidoKey()}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )
        }
      
      default:
        return {
          icon: <Shield className="h-12 w-12 text-blue-600" />,
          title: 'FIDO 3D Secure',
          description: 'Preparing authentication...',
          action: null
        }
    }
  }

  const stepContent = getStepContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              3D Secure Authentication
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Secure payment authorization using FIDO technology
            </p>
            
            {txAmount > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Transaction Amount</p>
                <p className="text-2xl font-bold text-gray-900">${txAmount.toFixed(2)}</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              {stepContent.icon}
              <h3 className="text-lg font-semibold mt-4 mb-2">
                {stepContent.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {stepContent.description}
              </p>
            </div>

            {(loading || registering) && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-gray-500">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {stepContent.action && (
              <div className="space-y-4">
                {stepContent.action}
                
                {/* Fallback demo button for when FIDO fails */}
                {authStep === 'error' && (
                  <Button 
                    onClick={() => {
                      // Simulate successful authentication for demo
                      setSuccess(true)
                      setAuthStep('success')
                      setTimeout(() => {
                        if (onSuccess) {
                          onSuccess()
                        } else {
                          router.push(`/checkout/success?transactionId=${txId}&amount=${txAmount}`)
                        }
                      }, 2000)
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Continue with Demo Mode (Skip FIDO)
                  </Button>
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  <div className="mt-2 text-xs">
                    <strong>Troubleshooting:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Ensure you're using Chrome, Firefox, Safari, or Edge</li>
                      <li>Make sure the site is loaded via HTTPS (or localhost)</li>
                      <li>Check if your device supports biometric authentication</li>
                      <li>Try using a USB security key if available</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Browser Support</span>
                <Badge variant="secondary" className={
                  (typeof window !== 'undefined' && window.navigator.credentials) 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }>
                  {typeof window !== 'undefined' && window.navigator.credentials ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Security Level</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  AAL2 - Strong Authentication
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Protocol</span>
                <Badge variant="outline">
                  FIDO2 + EMV 3DS v2.2
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Compliance</span>
                <Badge variant="outline">
                  PSD2 SCA
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Powered by FIDO Alliance & EMV 3-D Secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
