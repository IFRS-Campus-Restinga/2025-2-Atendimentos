function ButtonGoogle() {
    return (
      <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm">
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google Logo"
          style={{ width: "20px", height: "20px" }}
        />
        Sign in with Google
      </button>
    );
  }
  
  export default ButtonGoogle;
  