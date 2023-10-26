      const calculateDelay = (monitor) => {
        const runTime = nextScheduledRun(monitor.schedule)._date.ts +
          ((monitor.grace_period + monitor.tolerable_runtime) * 1000); // milliseconds from epoch
      
        return (runTime - Date.now()) / 1000; // delay in seconds
      };