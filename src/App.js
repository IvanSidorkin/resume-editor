import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

const ResumeEditor = () => {
  const [sections, setSections] = useState([
    { 
      id: 1, 
      type: 'personal', 
      title: 'Личная информация', 
      data: {
        name: 'Иван Иванов',
        email: 'example@mail.com',
        phone: '+77777777777',
        address: 'Новосибирск, Россия'
      }
    },
    { 
      id: 2, 
      type: 'experience', 
      title: 'Опыт работы', 
      items: [
        {
          id: 1,
          company: 'Компания',
          position: 'Разработчик',
          period: '2020-2023',
          description: 'Разработка веб-приложений'
        }
      ]
    },
    { 
      id: 3, 
      type: 'education', 
      title: 'Образование', 
      items: [
        {
          id: 1,
          institution: 'НГТУ НЭТИ',
          speciality: 'Прикладная математика и информатика',
          period: '2021-2025'
        }
      ]
    },
    {
      id: 4,
      type: 'about',
      title: 'О себе',
      text: 'Я целеустремленный разработчик с опытом работы в веб-разработке...'
    }
  ]);

  const [activeSection, setActiveSection] = useState(null);
  const [newSectionType, setNewSectionType] = useState('personal');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const sectionTypes = [
    { value: 'personal', label: 'Личная информация' },
    { value: 'experience', label: 'Опыт работы' },
    { value: 'education', label: 'Образование' },
    { value: 'skills', label: 'Навыки' },
    { value: 'about', label: 'О себе' },
  ];

  const handleAddSection = () => {
    let newSection;
    
    switch(newSectionType) {
      case 'personal':
        newSection = {
          id: Date.now(),
          type: 'personal',
          title: 'Личная информация',
          data: {
            name: '',
            email: '',
            phone: '',
            address: ''
          }
        };
        break;
      case 'experience':
        newSection = {
          id: Date.now(),
          type: 'experience',
          title: 'Опыт работы',
          items: []
        };
        break;
      case 'education':
        newSection = {
          id: Date.now(),
          type: 'education',
          title: 'Образование',
          items: []
        };
        break;
      case 'skills':
        newSection = {
          id: Date.now(),
          type: 'skills',
          title: 'Навыки',
          items: []
        };
        break;
      case 'about':
        newSection = {
          id: Date.now(),
          type: 'about',
          title: 'О себе',
          text: ''
        };
        break;
      default:
        return;
    }
    
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const handleDeleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
    if (activeSection === id) {
      setActiveSection(null);
    }
  };

  const handleUpdateSection = (id, field, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleUpdatePersonalData = (id, field, value) => {
    setSections(sections.map(section => {
      if (section.id === id && section.type === 'personal') {
        return { 
          ...section, 
          data: { ...section.data, [field]: value } 
        };
      }
      return section;
    }));
  };

  const handleAddItem = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId && section.items) {
        const newItem = section.type === 'experience' ? {
          id: Date.now(),
          company: '',
          position: '',
          period: '',
          description: ''
        } : section.type === 'education' ? {
          id: Date.now(),
          institution: '',
          speciality: '',
          period: ''
        } : {
          id: Date.now(),
          name: '',
          level: ''
        };
        
        return { ...section, items: [...section.items, newItem] };
      }
      return section;
    }));
  };

  const handleUpdateItem = (sectionId, itemId, field, value) => {
    setSections(sections.map(section => {
      if (section.id === sectionId && section.items) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return section;
    }));
  };

  const handleDeleteItem = (sectionId, itemId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId && section.items) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
  };

const handleDownloadPDF = async () => {
  const element = document.getElementById('resume-preview');
  
  if (!element) {
    console.error('Элемент #resume-preview не найден!');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    pdf.save('resume.pdf');
  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
  }
};

  const renderEditor = () => {

    if (!activeSection) return <div className="empty-editor">Выберите секцию для редактирования</div>;
    
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    return (
      <div className="section-editor">
        <h3>Редактирование: {section.title}</h3>
        <div className="form-group">
          <label>Заголовок секции:</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
          />
        </div>

        {section.type === 'personal' && (
          <div className="personal-form">
            <div className="form-group">
              <label>ФИО:</label>
              <input
                type="text"
                value={section.data.name}
                onChange={(e) => handleUpdatePersonalData(section.id, 'name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={section.data.email}
                onChange={(e) => handleUpdatePersonalData(section.id, 'email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Телефон:</label>
              <input
                type="tel"
                value={section.data.phone}
                onChange={(e) => handleUpdatePersonalData(section.id, 'phone', e.target.value)}
              />
              
            </div>
            <div className="form-group">
              <label>Адрес:</label>
              <input
                type="text"
                value={section.data.address}
                onChange={(e) => handleUpdatePersonalData(section.id, 'address', e.target.value)}
              />
            </div>
          </div>
        )}

        {section.type === 'about' && (
          <div className="about-form">
            <div className="form-group">
              <label>Текст о себе:</label>
              <textarea
                value={section.text}
                onChange={(e) => handleUpdateSection(section.id, 'text', e.target.value)}
                rows={8}
                placeholder="Расскажите о своих профессиональных качествах, интересах и целях..."
              />
            </div>
          </div>
        )}

        {(section.type === 'experience' || section.type === 'education' || section.type === 'skills') && (
          <div className="items-list">
            <h4>Элементы:</h4>
            <button onClick={() => handleAddItem(section.id)}>Добавить элемент</button>
            
            {section.items?.map(item => (
              <div key={item.id} className="item-editor">
                {section.type === 'experience' && (
                  <>
                    <div className="form-group">
                      <label>Компания:</label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Должность:</label>
                      <input
                        type="text"
                        value={item.position}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'position', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Период:</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'period', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Описание:</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'description', e.target.value)}
                        rows="3"
                      />
                    </div>
                  </>
                )}

                {section.type === 'education' && (
                  <>
                    <div className="form-group">
                      <label>Учебное заведение:</label>
                      <input
                        type="text"
                        value={item.institution}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'institution', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Специальность:</label>
                      <input
                        type="text"
                        value={item.speciality}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'speciality', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Период:</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'period', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {section.type === 'skills' && (
                  <>
                    <div className="form-group">
                      <label>Навык:</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Уровень:</label>
                      <input
                        type="text"
                        value={item.level}
                        onChange={(e) => handleUpdateItem(section.id, item.id, 'level', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <button 
                  className="delete-item-btn"
                  onClick={() => handleDeleteItem(section.id, item.id)}
                >
                  Удалить элемент
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          className="delete-btn"
          onClick={() => handleDeleteSection(section.id)}
        >
          Удалить секцию
        </button>
      </div>
    );
  };

  const renderPreview = () => {

    const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem === null || dragOverItem === null) return;
    
    const newSections = [...sections];
    const [removed] = newSections.splice(draggedItem, 1);
    newSections.splice(dragOverItem, 0, removed);
    
    setSections(newSections);
    setDraggedItem(null);
    setDragOverItem(null);
  };
  return (
    <div className="preview-container">
      <div className="preview-controls">
        <h2>Предпросмотр резюме</h2>
        <button 
          onClick={handleDownloadPDF}
          className="download-btn"
        >
          Скачать PDF
        </button>
      </div>

      <div id="resume-preview" className="resume-preview">
                {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`resume-section ${dragOverItem === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={() => {
              setDraggedItem(null);
              setDragOverItem(null);
            }}
          >
            <h3>{section.title}</h3>
            
            {section.type === 'personal' && (
              <div className="personal-info">
                <p><strong>{section.data.name}</strong></p>
                <p>Email: {section.data.email}</p>
                <p>Телефон: {section.data.phone}</p>
                <p>Адрес: {section.data.address}</p>
              </div>
            )}

            {section.type === 'about' && (
              <div className="about-content">
                <p style={{whiteSpace: 'pre-line'}}>{section.text}</p>
              </div>
            )}

            {section.type === 'experience' && section.items?.map(item => (
              <div key={item.id} className="experience-item">
                <h4>{item.position} - {item.company}</h4>
                <p className="period">{item.period}</p>
                <p className="description">{item.description}</p>
              </div>
            ))}

            {section.type === 'education' && section.items?.map(item => (
              <div key={item.id} className="education-item">
                <h4>{item.institution}</h4>
                <p>{item.speciality}</p>
                <p className="period">{item.period}</p>
              </div>
            ))}

            {section.type === 'skills' && (
              <ul className="skills-list">
                {section.items?.map(item => (
                  <li key={item.id}>
                    <strong>{item.name}:</strong> {item.level}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
     const handleDragStart = (e, index) => {
      setDraggedItem(index);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      setDragOverItem(index);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (draggedItem === null || dragOverItem === null) return;
      
      const newSections = [...sections];
      const [removed] = newSections.splice(draggedItem, 1);
      newSections.splice(dragOverItem, 0, removed);
      
      setSections(newSections);
      setDraggedItem(null);
      setDragOverItem(null);
    };
  return (
    <div className="resume-builder">
      <div className="editor-panel">
        <h2>Редактор резюме</h2>
        
        <div className="add-section">
          <h3>Добавить новую секцию</h3>
          <select
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value)}
          >
            {sectionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <button onClick={handleAddSection}>Добавить</button>
        </div>

              <div className="section-list">
        <h3>Секции резюме</h3>
        <ul>
          {sections.map((section, index) => (
            <li
              key={section.id}
              className={`
                ${activeSection === section.id ? 'active' : ''}
                ${dragOverItem === index ? 'drag-over' : ''}
                ${section.type === 'personal' ? 'no-drag' : ''}
              `}
              draggable={section.type !== 'personal'}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              onDragEnd={() => {
                setDraggedItem(null);
                setDragOverItem(null);
                document.querySelectorAll('.section-list li').forEach(el => {
                  el.classList.remove('dragging');
                });
              }}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>  

        {renderEditor()}
      </div>

      <div className="preview-panel">
        {renderPreview()}
      </div>
    </div>
  );
};

export default ResumeEditor;