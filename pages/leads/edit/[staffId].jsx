import MemberForm from '@/components/MemberForm'
import { useRouter } from 'next/router'
import React from 'react'

const EditStaffDetails = () => {
    const router = useRouter()
    const { staffId } = router.query
return (
    <>
    <MemberForm staffId={staffId}/>
    </>
)
}

export default EditStaffDetails
