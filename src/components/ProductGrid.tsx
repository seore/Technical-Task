export function ProductGrid({count=8}: {count?: number}) {
    return (
        <div className="product-grid" aria-busy="true" aria-live="polite">
            {Array.from({length: count}).map((_,i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton skeleton-card__media"/>
                    <div className="skeleton-card__body">
                        <div className="skeleton skeleton-line" style={{width: "40%"}}/>
                        <div className="skeleton skeleton-line" style={{width: "80%"}}/>
                         <div className="skeleton skeleton-line" style={{width: "30%"}}/>
                    </div>
                </div>
            ))}
        </div>
    );
}