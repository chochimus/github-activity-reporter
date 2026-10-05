
async function getUserActivity(username) {
  let response = await fetch(`https://api.github.com/users/${username}/events`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found.');
    }
    throw new Error(`Server responded with status: ${response.status}`);
  }

  return response.json(); 
}
async function app() {
  const [username] = process.argv.slice(2);

  if (username === undefined) {
    console.error('No username given');
    return;
  }
  
  try {
    const activities = await getUserActivity(username);
    generateReport(activities);
  } catch (error) {
    console.error(error.message);
  }
}

function generateReport(events) {
  events.forEach((event) => {
    switch (event.type) {
      case 'PushEvent':
        console.log(`- Pushed to ${event.repo.name}`);
        break;
      case 'IssuesEvent':
        console.log(`- ${event.action} issue`);
        break;
      case 'PullRequestEvent':
        console.log(`- ${event.action} a pull request`);
        break;
      case 'WatchEvent':
        console.log(`- Starred ${event.repo.name}`);
        break;
      case 'ForkEvent':
        console.log(`- Forked ${event.repo.name}`);
        break;
      case 'CreateEvent':
        console.log(`- Created ${event.payload.ref_type} on ${event.repo.name}`);
        break;
      case 'DeleteEvent':
        console.log(`- Deleted ${event.payload.ref_type} on ${event.repo.name}`);
        break;
      default:
        console.log(`- Unsupported event: ${event.type}`);
    }
  });
}

app();

