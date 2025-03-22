import { useEffect, useState } from "react";
import axios from 'axios';
import { showToast } from "./ToastComponent";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { integrateGetApi } from "@/utils/api";
import { useSession } from "next-auth/react";
import moment from "moment";
const MemberForm = ({ staffId = null }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const authToken = session?.user?.token
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState({})
  const [memberDetails, setMemberDetails] = useState({
    name: "",
    branch: "",
    email: "",
    phone: "",
    joiningDate: "",
    companyMobileNo: "",
  });
  const [workExperience, setWorkExperience] = useState({
    workExperience: false,
    lastCompanyWhereYouWork: "",
    workExperienceDescription: "",
    address: "",
  });
  const [personalFiles, setPersonalFiles] = useState({
    photo: null,
    AdharCard: null,
    PanCard: null,
    workExperienceCertificate: null,
    signature: null,
  });
  const [bankDetails, setBankDetails] = useState({
    fullName: "",
    ifscCode: "",
    accountNumber: "",
    branch: "",
    bankName: "",
  });

  useEffect(() => {
    if (staffId && authToken) {
      const url = process.env.NEXT_PUBLIC_API_SERVICE_BACKEND + 'staff/' + staffId
      integrateGetApi(url, setExistingData, authToken);
    }
  }, [staffId])

  useEffect(() => {
    if (existingData) {
      setMemberDetails({
        name: existingData?.name,
        branch: existingData?.branch,
        email: existingData?.email,
        phone: existingData?.phone,
        joiningDate: moment(existingData?.joiningDate).format('YYYY-MM-DD'),
        companyMobileNo: existingData?.companyMobileNo
      })
      setWorkExperience({
        workExperience: existingData?.personalInfo?.workExperience??false,
        lastCompanyWhereYouWork: existingData?.personalInfo?.lastCompanyWhereYouWork,
        workExperienceDescription: existingData?.personalInfo?.workExperienceDescription,
        address: existingData?.address,
      })
      setBankDetails({
        fullName: existingData?.bankDetail?.fullName,
        ifscCode: existingData?.bankDetail?.ifscCode,
        accountNumber: existingData?.bankDetail?.accountNumber,
        branch: existingData?.bankDetail?.branch,
        bankName: existingData?.bankDetail?.bankName,
      })
      setPersonalFiles({
        photo: existingData?.photo,
        AdharCard: existingData?.personalInfo?.AdharCard,
        PanCard: existingData?.personalInfo?.PanCard,
        workExperienceCertificate: existingData?.personalInfo?.workExperienceCertificate,
        signature: existingData?.personalInfo?.signature,
      })
    }
  }, [existingData])

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (e) => {
    const { name, value } = e.target;
    if (name=="workExperience"){
      setWorkExperience((prev) => ({
        ...prev,
        [name]: value === "true", // Convert string to boolean
      }));
    }
    else{
      setWorkExperience((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePersonalFileChange = ({ target: { name, files } }) => {
    if (!files?.[0]) return;
  
    const file = files[0];
    const fileURL = URL.createObjectURL(file);
  
    setPersonalFiles((prev) => ({
      ...prev,
      [name]: { file, preview: fileURL }
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };
 // Function for New Data Submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();

  // Append member details
  Object.entries(memberDetails).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("password", memberDetails?.phone);

  // Append work experience details
  Object.entries(workExperience).forEach(([key, value]) => {
    const formKey = key === "address" 
      ? key 
      : `personalInfo.${key}`;
    formData.append(formKey, value);
  });

  // Append personal files (images)
  Object.entries(personalFiles).forEach(([key, data]) => {
    if (data?.file) {
      const formKey = key === "photo" 
        ? key 
        : `personalInfo[${key}]`;
      formData.append(formKey, data?.file);
    }
  });

  // Append bank details
  Object.entries(bankDetails).forEach(([key, value]) => {
    formData.append(`bankDetail.${key}`, value);
  });

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_SERVICE_BACKEND}staff`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    console.log('Response:', response.data);
    showToast.success('Data submitted successfully');
    router.push('/members');
  } catch (error) {
    console.error('Error submitting data:', error);
    showToast.error('Failed to submit data');
  } finally {
    setLoading(false);
  }
};

// Function for Updating Data
const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();

  // Append member details
  Object.entries(memberDetails).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("password", memberDetails?.phone);

  // Append work experience details
  Object.entries(workExperience).forEach(([key, value]) => {
    const formKey = key === "address"
      ? key
      : `personalInfo.${key}`;
    formData.append(formKey, value);
  });

  // Append personal files (images) — Exclude URLs and Public IDs
  Object.entries(personalFiles).forEach(([key, data]) => {
    if (data?.file && !data?.url && !data?.public_id) {
      const formKey = key === "photo" 
        ? key 
        : `personalInfo[${key}]`;
      formData.append(formKey, data?.file);
    }
  });

  // Append bank details
  Object.entries(bankDetails).forEach(([key, value]) => {
    formData.append(`bankDetail.${key}`, value);
  });

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_SERVICE_BACKEND}staff/${staffId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    console.log('Response:', response.data);
    showToast.success('Data updated successfully');
    router.push('/members');
  } catch (error) {
    console.error('Error updating data:', error);
    showToast.error('Failed to update data');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Member Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Name", name: "name" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
            { label: "Joining Date", name: "joiningDate", type: "date" },
            { label: "Company Mobile No", name: "companyMobileNo" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
              <label htmlFor={name} className="block text-sm font-medium text-gray-900 sm:pt-1.5">
                {label}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={memberDetails[name]}
                  onChange={handleMemberChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:max-w-xs sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-900 sm:pt-1.5">
            Branch
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <select
              id="branch"
              name="branch"
              onChange={handleMemberChange}
              value={memberDetails?.branch}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600 sm:max-w-xs sm:text-sm"
            >
              <option value="">Select Branch</option>
              <option value="umra">Umra</option>
              <option value="motavarchha">Motavarchha</option>
            </select>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
          <label className="block text-sm font-medium text-gray-900 sm:pt-1.5">Work Experience</label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <label className="mr-4">
              <input
                type="radio"
                name="workExperience"
                value="true"
                checked={workExperience.workExperience === true}
                onChange={handleWorkExperienceChange}
                aria-label="Yes"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="workExperience"
                value="false"
                checked={workExperience.workExperience === false}
                onChange={handleWorkExperienceChange}
                aria-label="No"
              />
              No
            </label>
          </div>
        </div>

        {[
          { label: "Last Company Where You Worked", name: "lastCompanyWhereYouWork" },
          { label: "Work Experience Description", name: "workExperienceDescription" },
          { label: "Street Address", name: "address" },
        ].map(({ label, name }) => (
          <div key={name} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-900 sm:pt-1.5">{label}</label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <textarea
                id={name}
                name={name}
                rows={3}
                value={workExperience[name]}
                onChange={handleWorkExperienceChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:max-w-2xl sm:text-sm"
              />
            </div>
          </div>
        ))}

        <h3 className="text-lg font-semibold">Personal Information</h3>
        {["photo", "AdharCard", "PanCard", "workExperienceCertificate", "signature"].map((field) => (
          <div key={field} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
            <label htmlFor={field} className="block text-sm font-medium text-gray-900 sm:pt-1.5">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                id={field}
                name={field}
                type="file"
                accept="image/*"
                onChange={handlePersonalFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
              />
              {personalFiles[field] && (
              <img
                src={personalFiles[field]?.url??personalFiles[field]?.preview}
                alt={field}
                className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-300"
              />
            )}
            </div>
          </div>
        ))}

        <h3 className="text-lg font-semibold">Bank Details</h3>
        {["fullName", "ifscCode", "accountNumber", "branch", "bankName"].map((field) => (
          <div key={field} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2">
            <label htmlFor={field} className="block text-sm font-medium text-gray-900 sm:pt-1.5">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                id={field}
                name={field}
                type="text"
                value={bankDetails[field]}
                onChange={handleBankChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:max-w-xs sm:text-sm"
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between">

          <Button className={'cursor-pointer'} onClick={() => { router.back() }}>Cancel</Button>
          <Button
            type="submit"
            className={'cursor-pointer'}
            onClick={staffId?handleUpdate:handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              staffId ? "Update" : "Save"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default MemberForm;
