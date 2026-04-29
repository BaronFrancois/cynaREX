"use client";

import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <main className="min-h-[60vh]">{children}</main>
            <AppFooter />
        </>
    );
}

// // Layout.jsx
// import React from "react";

// export default function Layout({ children }) {
//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h1>Mon Site</h1>
//       </header>

//       <main style={styles.main}>{children}</main>

//       <footer style={styles.footer}>
//         <small>© 2025 Mon Site</small>
//       </footer>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//   },
//   header: {
//     background: "#2563eb",
//     color: "#fff",
//     padding: "1rem",
//   },
//   main: {
//     flex: 1,
//     padding: "2rem",
//     background: "#f9fafb",
//   },
//   footer: {
//     background: "#e5e7eb",
//     textAlign: "center",
//     padding: "1rem",
//   },
// };
