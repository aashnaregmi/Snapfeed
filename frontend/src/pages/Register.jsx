function Register() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Registration completed!");
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        {/* inputs... */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
