// Main app — wires shell + pages. Each artboard renders a different page.
const { useState: aUS } = React;

function CRMApp({ initial = 'dashboard' }) {
  const [page, setPage] = aUS(initial);
  let Page = DashboardPage;
  if (page === 'contacts')  Page = ContactsPage;
  if (page === 'pipeline')  Page = PipelinePage;
  if (page === 'campaigns') Page = CampaignsPage;
  if (page === 'automation') Page = AutomationPage;
  if (page === 'inbox')     Page = InboxPage;
  return (
    <div className="app">
      <Sidebar active={page} onNav={setPage}/>
      <main className="main">
        <Page/>
      </main>
    </div>
  );
}

window.CRMApp = CRMApp;
