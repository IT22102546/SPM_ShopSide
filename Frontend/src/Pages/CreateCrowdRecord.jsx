import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateCrowdRecord() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    shopname: currentUser.shopname,
    email: currentUser.email,
    brnumber: currentUser.brnumber,
    crowdCount: "0", // Default value
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button when the form is submitted

    try {
      dispatch({ type: "CREATE_CROWD_RECORD_START" });
      const res = await fetch("/api/crowd/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.message);
        dispatch({ type: "CREATE_CROWD_RECORD_FAILURE", payload: data.message });
        setIsSubmitting(false); // Re-enable the button on error
        return;
      }

      setSuccessMessage("Crowd record created successfully");
      dispatch({ type: "CREATE_CROWD_RECORD_SUCCESS", payload: data.record });
      navigate("/dashboard?tab=crowd"); // Navigate to the crowd page after success
    } catch (error) {
      setErrorMessage("Failed to create crowd record");
      dispatch({ type: "CREATE_CROWD_RECORD_FAILURE", payload: error.message });
      setIsSubmitting(false); // Re-enable the button on error
    }
  };

  return (
    <div className="bg-gray-100 w-full">
      <div className="p-10 bg-gray-50 flex flex-wrap justify-between gap-32">
        <div>
          <h1 className="text-2xl font-cinzel font-semibold">
            Welcome back!,{" "}
            <span className="text-gradient-to-r from-purple-700 to-purple-900 font-normal">
              {currentUser.shopname}
            </span>
            <br />
            <div className="text-sm font-sans font-normal mt-5">
              <h1>
                Shop ID{" "}
                <span className="text-gray-600 font-normal mx-10">
                  : {currentUser.shopID}
                </span>
              </h1>
              <h1>
                Email{" "}
                <span className="text-gray-600 font-normal mx-14">
                  : {currentUser.email}
                </span>
              </h1>
              <h1>
                BR Number{" "}
                <span className="text-gray-600 font-normal mx-4">
                  : {currentUser.brnumber}
                </span>
              </h1>
            </div>
          </h1>
        </div>

        <div className="flex justify-center gap-5">
          <h1 className="font-cinzel">Your Shop's Crowd Count now is</h1>
          <h1 className="text-5xl font-bold font-sans text-purple-700">
            {currentUser.brnumber}
          </h1>
        </div>
      </div>

      <div>
        <div className="p-10 items-center justify-center">
          <h1 className="text-2xl font-sans font-semibold text-indigo-700">
            Create crowd record
          </h1>

          <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 mt-5">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="shopname" value="Shop Name" />
              </div>
              <TextInput
                id="shopname"
                type="text"
                placeholder="Shop Name"
                readOnly
                value={formData.shopname}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@flowbite.com"
                readOnly
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="brnumber" value="Br Number" />
              </div>
              <TextInput
                id="brnumber"
                type="text"
                readOnly
                value={formData.brnumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="crowdcount" value="Crowd Count" />
              </div>
              <TextInput
                id="crowdcount"
                type="text"
                onChange={handleChange}
              />
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-blue-700"
              disabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
