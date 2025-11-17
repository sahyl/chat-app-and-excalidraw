"use client"
import { SwitchableCard } from '@/components/SwitchableCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const  [loading , setLoading] = useState(false)
    const [ createRoomSlug , setCreateRoomSlug] = useState('')
    const [ joinRoomSlug  , setJoinRoomSlug] = useState('')
    const [error , setError]  = useState('')
    const router = useRouter()

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token){
            router.push('/signin')
        }

    },[router])
    
    const handleCreateRoom = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true)

        const token = localStorage.getItem('token')
        try {
            const res = await fetch("http://localhost:3001/api/room/create-room", {
                method: "POST",
                headers : {
                    "Content-Type" : "application/json",
                    token: `${token}`
                },
                body: JSON.stringify({createRoomSlug})
            })

            const data = await res.json()
            if (!res.ok){
                console.log(data)
                console.log(token)
                setError(data.message || "Something went wrong")
                return 
            }
            router.push(`/canvas/${data.room.slug}`)

        } catch (error) {
            setError("Network error")
            
        }finally{
            setLoading(false)
        }
    }
    const handleJoinRoom = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true)
        const token = localStorage.getItem('token')
    try {
        const res = await fetch(`http://localhost:3001/api/room/join-room/${joinRoomSlug}`,{
            method: "GET",
            headers:{
              "Content-Type":"application/json",
              "token":token ?? " "
            },})

            const data = await res.json()
            if(!res.ok){
                setError(data.message || "failed to join room")
                return 
            }

            router.push(`/canvas/${data.room.slug}`)
        
    } catch (error) {
        
    }finally{
        setLoading(false)

    }}
    

  

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-md">
            <SwitchableCard
              leftTitle="Create Room"
              rightTitle="Join Room"
              leftContent={
                <form onSubmit={handleCreateRoom} className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Create a Room</h2>
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="create-slug">Room Slug</Label>
                    <Input
                      id="create-slug"
                      type="text"
                      placeholder="Enter a unique room name"
                      value={createRoomSlug}
                      onChange={(e) => setCreateRoomSlug(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Room"}
                  </Button>
                </form>
              }
              rightContent={
                <form onSubmit={handleJoinRoom} className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Join a Room</h2>
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="join-slug">Room Slug</Label>
                    <Input
                      id="join-slug"
                      type="text"
                      placeholder="Enter room slug to join"
                      value={joinRoomSlug}
                      onChange={(e) => setJoinRoomSlug(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Joining..." : "Join Room"}
                  </Button>
                </form>
              }
            />
          </div>
        </div>
      )
}


export default page
