import React, { Suspense, useState, useDeferredValue } from "react";
import "./App.css";
import { fetchProfileData } from "./fakeApi.js";
import { RefreshPage } from "./refresh";
import { TranslationPage } from "./input";

const initialResource = fetchProfileData(0);

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

function ProfilePage({ resource }) {
  const deferredResource = React.unstable_useDeferredValue(resource, {
    timeoutMs: 1000
  });

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline
            resource={deferredResource}
            isStale={deferredResource !== resource}
          />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  console.log("resource", resource);
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}> {post.text}</li>
      ))}
    </ul>
  );
}

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = React.unstable_useTransition({
    timeoutMs: 3000
  });

  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? "Loading..." : null}
      <ProfilePage resource={resource} />
      <RefreshPage />
      <TranslationPage />
    </>
  );
}

export default App;
