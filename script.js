(function () {
    'use strict';

    /* ---------- Menu mobile ---------- */
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu');

    function setMenu(open) {
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }

    toggle.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    /* ---------- Link ativo conforme a rolagem ---------- */
    var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
    var sections = links
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) {
                    var active = a.getAttribute('href') === '#' + entry.target.id;
                    a.classList.toggle('active', active);
                    if (active) a.setAttribute('aria-current', 'true');
                    else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });

        /* ---------- Animação de entrada ---------- */
        var reveal = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
    } else {
        document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Rodapé e tempo de carreira ---------- */
    var now = new Date();
    document.getElementById('year').textContent = now.getFullYear();

    var yearsEl = document.querySelector('[data-years-since]');
    if (yearsEl) {
        var parts = yearsEl.getAttribute('data-years-since').split('-');
        var since = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
        var years = Math.floor((now - since) / (365.25 * 24 * 3600 * 1000));
        if (years >= 1) yearsEl.textContent = years + '+';
    }

    /* ---------- Calculadora de link budget ---------- */
    var form = document.getElementById('budget-form');
    var out = {
        rx: document.getElementById('rx'),
        status: document.getElementById('status'),
        fiber: document.getElementById('l-fiber'),
        conn: document.getElementById('l-conn'),
        splice: document.getElementById('l-splice'),
        split: document.getElementById('l-split'),
        total: document.getElementById('l-total'),
        margin: document.getElementById('margin')
    };

    var MIN_MARGIN_DB = 3;

    function num(id) {
        var el = form.elements[id];
        var raw = String(el.value).replace(',', '.').trim();
        return raw === '' ? NaN : Number(raw);
    }

    function nonNegative(v) {
        return isFinite(v) ? Math.max(0, v) : NaN;
    }

    function fmt(v, digits) {
        return isFinite(v)
            ? v.toFixed(digits === undefined ? 1 : digits).replace('.', ',')
            : '—';
    }

    function setStatus(state, text) {
        out.status.setAttribute('data-state', state);
        out.status.textContent = text;
    }

    function calculate() {
        var tx = num('tx');
        var dist = nonNegative(num('dist'));
        var att = num('wl');
        var splitLoss = num('split');
        var conn = nonNegative(num('conn'));
        var connLoss = nonNegative(num('connLoss'));
        var splice = nonNegative(num('splice'));
        var spliceLoss = nonNegative(num('spliceLoss'));
        var sens = num('sens');
        var sat = num('sat');

        var fiber = dist * att;
        var connectors = conn * connLoss;
        var splices = splice * spliceLoss;
        var total = fiber + connectors + splices + splitLoss;
        var rx = tx - total;
        var margin = rx - sens;

        out.fiber.textContent = fmt(fiber) + ' dB';
        out.conn.textContent = fmt(connectors) + ' dB';
        out.splice.textContent = fmt(splices) + ' dB';
        out.split.textContent = fmt(splitLoss) + ' dB';
        out.total.textContent = fmt(total) + ' dB';

        if (!isFinite(rx)) {
            out.rx.textContent = '—';
            out.margin.textContent = '—';
            setStatus('idle', 'Preencha os campos');
            return;
        }

        out.rx.textContent = fmt(rx);

        if (!isFinite(margin)) {
            out.margin.textContent = '—';
            setStatus('idle', 'Informe a sensibilidade');
            return;
        }

        out.margin.textContent = fmt(margin) + ' dB';

        if (isFinite(sat) && rx > sat) {
            setStatus('bad', 'Acima da saturação do receptor');
        } else if (margin < 0) {
            setStatus('bad', 'Sinal insuficiente');
        } else if (margin < MIN_MARGIN_DB) {
            setStatus('warn', 'Margem apertada');
        } else {
            setStatus('ok', 'Enlace dentro da margem');
        }
    }

    form.addEventListener('input', calculate);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    calculate();
})();
