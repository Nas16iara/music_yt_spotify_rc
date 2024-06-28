import { useAuthContext } from "../context/AuthContext"; // Assuming AuthContext is defined in a separate file
const Profile = () => {
  const { authUser } = useAuthContext();
  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.header}>Profile</h2>
        {authUser ? (
          <div style={styles.profileInfo}>
            <p>
              <strong>Username:</strong> {authUser.username}
              <br />
              <strong>Email:</strong> {authUser.email}
            </p>
            {/* You can add more profile information here */}
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginTop: "50px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  profileInfo: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};

export default Profile;
