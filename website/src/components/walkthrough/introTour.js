import introJs from 'intro.js';
import 'intro.js/introjs.css';

export const startIntroTour = ({
  openEvents,
  openIncidents,
  openSummary,
  selectFirstEvent,
}) => {

  console.log('=== Starting Intro Tour ===');

  const waitForElement = (selector, timeout = 5000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const el = document.querySelector(selector);
        if (el) {
          console.log(`Found element: ${selector}`);
          return resolve(el);
        }
        if (Date.now() - start > timeout) {
          console.log(`Timeout waiting for: ${selector}`);
          return reject(`Timeout waiting for ${selector}`);
        }
        setTimeout(check, 100);
      };
      check();
    });

  // Define all tour segments
  const tourSegments = [
    {
      name: 'welcome',
      steps: [
        { 
          intro: "Welcome to LOOP! Let's quickly walk through how it works." 
        }, 
        { 
          element: '#map-view', 
          intro: "This is the map. It shows you nearby events and incidents." 
        }, 
		{
			element: '#search-bar',
			intro: "You can search for specific types of events or incidents + keywords using this search bar."
		},
		{
			element: '#add-post-btn',
			intro: "To create a post, click here to fill out a form to add a new event or incident."
		},
        { 
          element: '#logo', 
          intro: "This is the LOOP logo. Click it anytime to return to this homepage." 
        }, 
        { 
          element: '#list-buttons', 
          intro: "Here are the main navigation buttons to explore activity." 
        }, 
        { 
          element: '#events-button', 
          intro: "Let's look at events near us, click Events to see only events and their details." 
        }
      ]
    },
    {
      name: 'events',
      beforeStart: async () => {
        openEvents();
        await waitForElement('#event-list');
      },
      steps: [
        { 
          element: '#event-list', 
          intro: "This is the list section. Events here are sorted by distance." 
        }
      ]
    },
    {
      name: 'event-right-section',
      beforeStart: async () => {
        // console.log('Selecting first event for detail segment');
        selectFirstEvent();
        await waitForElement('#event-detail');
      },
      steps: [
        { 
          element: '#event-right-section', 
          intro: "This is the event detail page with all the event information." 
        }, 
        { 
          element: '#event-chat-button', 
          intro: "Each event or incident has its own chat where you can discuss with other attendees." 
        }
      ]
    },
    {
      name: 'incidents',
      beforeStart: async () => {
        console.log('Opening incidents for incidents segment');
        openIncidents(); // This will open the incidents list
        // Wait for incidents container to be visible
        await waitForElement('#incident-container');
      },
      steps: [
		{ 
          element: '#incidents-button', 
          intro: "This button is similar to the events tab but shows only incidents." 
        },
        { 
          element: '#incident-container', 
          intro: "This shows safety-related incidents in the area. You can see details and discuss safety concerns here." 
        }, 
      ]
    },
    {
      name: 'all-and-global-chat',
      beforeStart: async () => {
        console.log('Opening all/summary for global chat segment');
        openSummary(); // This opens the summary/All view
        // Wait for both elements to be available
        await Promise.all([
          waitForElement('#summary-container'),
          waitForElement('#global-chat', 7000) // Give extra time for global chat to load
        ]);
      },
      steps: [
		{ 
          element: '#all-button', 
          intro: "This list shows both events and incidents together." 
        }, 
		{ 
          element: '#summary-container', 
          intro: "Here you can browse all activities and click any item to see details or join its chat." 
        },
        { 
          element: '#global-chat', 
          intro: "This is the global chat only on the all section, where you can discuss with everyone about anything in the area." 
        } 
      ]
    },
    {
      name: 'other-features',
      steps: [
        { 
          element: '#about-button', 
          intro: "Learn more about LOOP and it's creators here." 
        },
        { 
          element: '#help-button', 
          intro: "Need help or another tour? Start here." 
        },
        {
          intro: "That's the tour! If you make a profile, it will let you save events, upvote, edit posts, and chat."
        }
      ]
    }
  ];

  // Function to run a tour segment
  const runTourSegment = async (segmentIndex) => {
    if (segmentIndex >= tourSegments.length) {
      console.log('Tour completed');
      return;
    }

    const segment = tourSegments[segmentIndex];

    if (segment.beforeStart) {
      try {
        await segment.beforeStart();
      } catch (err) {
        console.warn(`Error in beforeStart for segment ${segment.name}:`, err);
      }
    }

    const intro = introJs();
    
    intro.setOptions({
      steps: segment.steps,
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      nextLabel: 'Next →',
      prevLabel: '← Back',
      doneLabel: 'Finish',
    });

    intro.oncomplete(() => {
      console.log(`Segment ${segment.name} completed`);
      setTimeout(() => runTourSegment(segmentIndex + 1), 300);
    });

    intro.onexit(() => {
      console.log(`Segment ${segment.name} exited`);
    });

    intro.start();
  };

  // start the first segment
  runTourSegment(0);
};