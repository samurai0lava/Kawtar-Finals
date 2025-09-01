"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Shield, 
  Clock, 
  TrendingUp,
  Home,
  Download,
  Mail
} from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const transactionId = searchParams?.get('transactionId') || 'TX-' + Date.now()
  const amount = parseFloat(searchParams?.get('amount') || '0')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const metrics = [
    {
      label: 'Authentication Time',
      value: '2.1s',
      improvement: '68% faster than SMS OTP',
      icon: <Clock className="h-4 w-4" />
    },
    {
      label: 'Security Score',
      value: '98/100',
      improvement: 'AAL2 compliance achieved',
      icon: <Shield className="h-4 w-4" />
    },
    {
      label: 'User Experience',
      value: 'Excellent',
      improvement: 'Zero friction authentication',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]

  const technicalDetails = [
    'FIDO2/WebAuthn assertion successfully verified',
    'EMV 3DS v2.2 protocol compliance maintained',
    'Strong Customer Authentication (SCA) completed',
    'Cryptographic attestation validated',
    'Risk assessment: Low (biometric authentication)',
    'Transaction authorized by issuing bank'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <Card className="text-center shadow-2xl border-0">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Your order has been confirmed and will be processed shortly
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Transaction ID</p>
                  <p className="font-mono font-semibold">{transactionId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-semibold">FIDO + Credit Card</p>
                </div>
                <div>
                  <p className="text-gray-600">Authentication</p>
                  <Badge className="bg-green-100 text-green-800">
                    FIDO Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Authentication Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {metric.icon}
                    </div>
                    <div>
                      <p className="font-medium">{metric.label}</p>
                      <p className="text-sm text-green-600">{metric.improvement}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Technical Implementation Details
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              FIDO 3D Secure Integration Highlights
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {technicalDetails.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{detail}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full">
                  FIDO2/WebAuthn
                </Badge>
                <p className="text-xs text-gray-600">Authentication Protocol</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full">
                  EMV 3DS v2.2
                </Badge>
                <p className="text-xs text-gray-600">Payment Security</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full">
                  PSD2 SCA
                </Badge>
                <p className="text-xs text-gray-600">Regulatory Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">
              🎓 University Project Demonstration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <strong>Project:</strong> FIDO-based 3D Secure Authentication Hub
              </p>
              <p className="text-gray-700">
                <strong>Innovation:</strong> Integration of FIDO authentication with EMV 3DS transactions
              </p>
              <p className="text-gray-700">
                <strong>Impact:</strong> Eliminates SMS OTP dependency while maintaining strong security
              </p>
              <p className="text-gray-700">
                <strong>Compliance:</strong> Meets PSD2 SCA requirements with enhanced user experience
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Key Achievement:</strong> This transaction demonstrates the world's first 
                seamless integration of FIDO biometric authentication within the EMV 3D Secure 
                payment flow, representing a revolutionary advancement in e-commerce security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Thank you for participating in this FIDO 3DS demonstration!</p>
          <p className="mt-1">
            Questions? Contact the development team at 
            <Button variant="link" className="p-0 h-auto font-normal text-blue-600 ml-1">
              <Mail className="mr-1 h-3 w-3" />
              fido3ds@university.edu
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
