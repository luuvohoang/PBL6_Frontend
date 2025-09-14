const Sidebar = ({ activeSection, onSectionChange }) => {
    const sections = [
        {
            id: 'cctv-view-all',
            title: 'All CCTVs', // Rút gọn text
            icon: (
                <svg className="svg-mutil_cctv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                </svg>
            )
        },
        {
            id: 'site-A',
            title: 'Site A', // Rút gọn text
            icon: <svg>...</svg>
        },
        {
            id: 'site-B',
            title: 'Site B', // Rút gọn text
            icon: <svg>...</svg>
        },
        {
            id: 'underground-vertical-zone',
            title: 'Underground', // Rút gọn text
            icon: <svg>...</svg>
        }
    ];

    return (
        <div className="sidebar-multicctv">
            <div className="item-title">MONITORING</div>
            <hr />

            {sections.map(section => (
                <div
                    key={section.id}
                    className={`sidebar-multicctv-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => onSectionChange(section.id)}
                >
                    <div className="icon">{section.icon}</div>
                    <div className="title">{section.title}</div>
                </div>
            ))}

            <div className="item-title">SAVED</div>
            <hr />

            <div
                className={`sidebar-multicctv-item ${activeSection === 'show-bookmark' ? 'active' : ''}`}
                onClick={() => onSectionChange('show-bookmark')}
            >
                <div className="title">Bookmarks</div>
            </div>
        </div>
    );
};

export default Sidebar;