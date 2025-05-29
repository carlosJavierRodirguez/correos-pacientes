export function paginateData({ data, containerId, paginationId, renderItemFn, itemsPerPage = 4 }) {
    let currentPage = 1;

    function renderPage() {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = data.slice(start, end);

        items.forEach(item => {
            const element = renderItemFn(item);
            if (element instanceof Node) {
                container.appendChild(element);
            }
        });

        renderPagination();
    }

    function renderPagination() {
        const pagination = document.getElementById(paginationId);
        if (!pagination) return;

        const totalPages = Math.ceil(data.length / itemsPerPage);
        if (totalPages <= 1) {
            pagination.innerHTML = "";
            return;
        }

        pagination.innerHTML = "";

        const ul = document.createElement("ul");
        ul.className = "pagination justify-content-center gap-1";

        const createPageItem = (label, page, disabled = false, active = false) => {
            const li = document.createElement("li");
            li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`;

            const a = document.createElement("a");
            a.className = "page-link rounded-pill px-3 shadow-sm border-0";
            a.href = "#";
            a.textContent = label;

            if (!disabled && !active && page !== null) {
                a.addEventListener("click", (e) => {
                    e.preventDefault();
                    currentPage = page;
                    renderPage();
                });
            }

            li.appendChild(a);
            return li;
        };

        // Botón « Anterior
        ul.appendChild(createPageItem("«", currentPage - 1, currentPage === 1));

        // Lógica de ventana deslizante
        const maxVisible = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            ul.appendChild(createPageItem(i, i, false, i === currentPage));
        }

        // Botón » Siguiente
        ul.appendChild(createPageItem("»", currentPage + 1, currentPage === totalPages));

        pagination.appendChild(ul);
    }





    renderPage();
}
