(function() {
  'use strict';

  // Configuração do Super Pixel
  const SUPER_PIXEL_CONFIG = {
    endpoint: 'https://seu-dominio.com/api/track',
    superPixelId: window.SUPER_PIXEL_ID || null,
    debug: window.SUPER_PIXEL_DEBUG || false
  };

  // Verificar se o Super Pixel ID foi definido
  if (!SUPER_PIXEL_CONFIG.superPixelId) {
    console.error('Super Pixel: ID não definido. Defina window.SUPER_PIXEL_ID antes de carregar o script.');
    return;
  }

  // Utilitários
  const utils = {
    // Gerar UUID simples
    generateUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    // Obter ou criar session ID
    getSessionId: function() {
      let sessionId = sessionStorage.getItem('sp_session_id');
      if (!sessionId) {
        sessionId = this.generateUUID();
        sessionStorage.setItem('sp_session_id', sessionId);
      }
      return sessionId;
    },

    // Obter ou criar user ID
    getUserId: function() {
      let userId = localStorage.getItem('sp_user_id');
      if (!userId) {
        userId = this.generateUUID();
        localStorage.setItem('sp_user_id', userId);
      }
      return userId;
    },

    // Obter informações do dispositivo
    getDeviceInfo: function() {
      const ua = navigator.userAgent;
      return {
        userAgent: ua,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        screenResolution: screen.width + 'x' + screen.height,
        viewportSize: window.innerWidth + 'x' + window.innerHeight,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      };
    },

    // Obter informações da página
    getPageInfo: function() {
      return {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        domain: window.location.hostname,
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      };
    },

    // Obter dados de UTM
    getUTMParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content'),
        gclid: urlParams.get('gclid'),
        fbclid: urlParams.get('fbclid')
      };
    },

    // Detectar informações de e-commerce
    getEcommerceData: function() {
      const data = {};
      
      // Tentar detectar preço na página
      const priceSelectors = [
        '[data-price]',
        '.price',
        '.valor',
        '.preco',
        '[class*="price"]',
        '[id*="price"]'
      ];
      
      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const price = element.textContent.replace(/[^\d,.-]/g, '');
          if (price) {
            data.price = price;
            break;
          }
        }
      }

      // Tentar detectar produto
      const productSelectors = [
        '[data-product-name]',
        '.product-name',
        '.produto-nome',
        'h1',
        '.title'
      ];

      for (const selector of productSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          data.productName = element.textContent.trim();
          break;
        }
      }

      return data;
    }
  };

  // Coletor de dados principal
  const dataCollector = {
    // Coletar todos os dados disponíveis
    collectAllData: function() {
      return {
        timestamp: new Date().toISOString(),
        sessionId: utils.getSessionId(),
        userId: utils.getUserId(),
        superPixelId: SUPER_PIXEL_CONFIG.superPixelId,
        device: utils.getDeviceInfo(),
        page: utils.getPageInfo(),
        utm: utils.getUTMParams(),
        ecommerce: utils.getEcommerceData(),
        performance: this.getPerformanceData(),
        engagement: this.getEngagementData()
      };
    },

    // Dados de performance
    getPerformanceData: function() {
      if (!window.performance) return {};
      
      const timing = window.performance.timing;
      const navigation = window.performance.navigation;
      
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: window.performance.getEntriesByType ? 
          window.performance.getEntriesByType('paint')[0]?.startTime : null,
        navigationType: navigation.type,
        redirectCount: navigation.redirectCount
      };
    },

    // Dados de engajamento
    getEngagementData: function() {
      return {
        scrollDepth: this.getScrollDepth(),
        timeOnPage: Date.now() - window.spStartTime,
        clickCount: window.spClickCount || 0,
        formInteractions: window.spFormInteractions || 0
      };
    },

    // Calcular profundidade do scroll
    getScrollDepth: function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      return Math.round((scrollTop + windowHeight) / documentHeight * 100);
    }
  };

  // Rastreador de eventos
  const eventTracker = {
    // Enviar evento para o servidor
    sendEvent: function(eventName, eventData = {}) {
      const data = {
        ...dataCollector.collectAllData(),
        eventName: eventName,
        eventData: eventData
      };

      if (SUPER_PIXEL_CONFIG.debug) {
        console.log('Super Pixel Event:', eventName, data);
      }

      // Enviar via fetch
      this.sendToServer(data);
      
      // Enviar para Facebook Pixel se disponível
      this.sendToFacebookPixel(eventName, eventData);
    },

    // Enviar para servidor
    sendToServer: function(data) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(SUPER_PIXEL_CONFIG.endpoint, JSON.stringify(data));
      } else {
        fetch(SUPER_PIXEL_CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(error => {
          if (SUPER_PIXEL_CONFIG.debug) {
            console.error('Super Pixel: Erro ao enviar evento', error);
          }
        });
      }
    },

    // Enviar para Facebook Pixel
    sendToFacebookPixel: function(eventName, eventData) {
      if (typeof fbq !== 'undefined') {
        // Mapear eventos personalizados para eventos padrão do Facebook
        const fbEventMap = {
          'page_view': 'PageView',
          'purchase': 'Purchase',
          'add_to_cart': 'AddToCart',
          'initiate_checkout': 'InitiateCheckout',
          'lead': 'Lead',
          'complete_registration': 'CompleteRegistration',
          'search': 'Search',
          'view_content': 'ViewContent'
        };

        const fbEventName = fbEventMap[eventName] || 'CustomEvent';
        
        if (fbEventName === 'CustomEvent') {
          fbq('trackCustom', eventName, eventData);
        } else {
          fbq('track', fbEventName, eventData);
        }
      }
    }
  };

  // Inicialização
  const init = function() {
    // Marcar tempo de início
    window.spStartTime = Date.now();
    window.spClickCount = 0;
    window.spFormInteractions = 0;

    // Enviar evento de page view
    eventTracker.sendEvent('page_view');

    // Rastrear cliques
    document.addEventListener('click', function(e) {
      window.spClickCount++;
      
      // Rastrear cliques em links
      if (e.target.tagName === 'A') {
        eventTracker.sendEvent('link_click', {
          url: e.target.href,
          text: e.target.textContent.trim()
        });
      }

      // Rastrear cliques em botões
      if (e.target.tagName === 'BUTTON' || e.target.type === 'submit') {
        eventTracker.sendEvent('button_click', {
          text: e.target.textContent.trim(),
          type: e.target.type
        });
      }
    });

    // Rastrear interações com formulários
    document.addEventListener('input', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        window.spFormInteractions++;
        
        // Debounce para não enviar muitos eventos
        clearTimeout(window.spFormTimeout);
        window.spFormTimeout = setTimeout(() => {
          eventTracker.sendEvent('form_interaction', {
            fieldType: e.target.type,
            fieldName: e.target.name
          });
        }, 1000);
      }
    });

    // Rastrear scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = dataCollector.getScrollDepth();
        if (scrollDepth > (window.spMaxScroll || 0)) {
          window.spMaxScroll = scrollDepth;
          if (scrollDepth >= 25 && scrollDepth < 50) {
            eventTracker.sendEvent('scroll_depth', { depth: 25 });
          } else if (scrollDepth >= 50 && scrollDepth < 75) {
            eventTracker.sendEvent('scroll_depth', { depth: 50 });
          } else if (scrollDepth >= 75) {
            eventTracker.sendEvent('scroll_depth', { depth: 75 });
          }
        }
      }, 250);
    });

    // Rastrear tempo na página
    setInterval(() => {
      const timeOnPage = Date.now() - window.spStartTime;
      if (timeOnPage > 0 && timeOnPage % 30000 === 0) { // A cada 30 segundos
        eventTracker.sendEvent('time_on_page', { 
          seconds: Math.floor(timeOnPage / 1000) 
        });
      }
    }, 1000);

    // Rastrear saída da página
    window.addEventListener('beforeunload', function() {
      eventTracker.sendEvent('page_exit', {
        timeOnPage: Date.now() - window.spStartTime,
        scrollDepth: dataCollector.getScrollDepth()
      });
    });

    // Rastrear mudanças de visibilidade
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        eventTracker.sendEvent('page_hidden');
      } else {
        eventTracker.sendEvent('page_visible');
      }
    });
  };

  // API pública
  window.SuperPixel = {
    track: eventTracker.sendEvent.bind(eventTracker),
    getData: dataCollector.collectAllData.bind(dataCollector),
    config: SUPER_PIXEL_CONFIG
  };

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); 