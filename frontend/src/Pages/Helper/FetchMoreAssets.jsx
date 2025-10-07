export   const fetchMoreAssets = () => {
    if (displayAssets.length >= assets.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      const nextAssets = assets.slice(displayAssets.length, displayAssets.length + 4);
      setDisplayAssets(prev => [...prev, ...nextAssets]);
    }, 300);
  };
