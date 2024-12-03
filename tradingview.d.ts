declare namespace TradingView {
    class widget {
      constructor(options: {
        autosize?: boolean;
        symbol: string;
        interval: string;
        timezone?: string;
        theme?: string;
        style?: string | number;
        locale?: string;
        toolbar_bg?: string;
        enable_publishing?: boolean;
        allow_symbol_change?: boolean;
        container_id: string;
      });
    }
  }
  