import React, { useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Slideshow = ({
    children,
    controles = false,
    autoplay = false,
    velocidad = "500",
    intervalo = "5000"
}) => {
    const slideshow = useRef(null);
    const intervaloSlideshow = useRef(null);

    const siguiente = useCallback(() => {
        if (slideshow.current && slideshow.current.children.length > 0) {
            const primerElemento = slideshow.current.children[0];
            slideshow.current.style.transition = `${velocidad}ms ease-out all`;
            const tamañoSlide = slideshow.current.children[0].offsetWidth * 3; // Ajustar para 3 productos
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

            const transicion = () => {
                slideshow.current.style.transition = 'none';
                slideshow.current.style.transform = `translateX(0)`;
                slideshow.current.appendChild(primerElemento);
                slideshow.current.removeEventListener('transitionend', transicion);
            }

            slideshow.current.addEventListener('transitionend', transicion);
        }
    }, [velocidad]);

    const anterior = () => {
        if (slideshow.current && slideshow.current.children.length > 0) {
            const index = slideshow.current.children.length - 1;
            const ultimoElemento = slideshow.current.children[index];
            slideshow.current.insertBefore(ultimoElemento, slideshow.current.firstChild);

            slideshow.current.style.transition = 'none';
            const tamañoSlide = slideshow.current.children[0].offsetWidth * 3; // Ajustar para 3 productos
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

            setTimeout(() => {
                slideshow.current.style.transition = `${velocidad}ms ease-out all`;
                slideshow.current.style.transform = `translateX(0)`;
            }, 30);
        }
    }

    useEffect(() => {
        if (autoplay) {
            intervaloSlideshow.current = setInterval(() => {
                siguiente();
            }, intervalo);

            slideshow.current.addEventListener('mouseenter', () => {
                clearInterval(intervaloSlideshow.current);
            });

            slideshow.current.addEventListener('mouseleave', () => {
                intervaloSlideshow.current = setInterval(() => {
                    siguiente();
                }, intervalo);
            });
        }
        return () => {
            clearInterval(intervaloSlideshow.current);
        }
    }, [autoplay, intervalo, siguiente]);

    useEffect(() => {
        // Reset the slideshow when children change
        if (slideshow.current) {
            slideshow.current.style.transition = 'none';
            slideshow.current.style.transform = `translateX(0)`;
        }
    }, [children]);

    return (
        <ContenedorPrincipal>
            <ContenedorSlideshow ref={slideshow}>
                {children}
            </ContenedorSlideshow>
            {controles && <Controles>
                <Control onClick={anterior} aria-label="Anterior">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Control>
                <Control derecho onClick={siguiente} aria-label="Siguiente">
                    <FontAwesomeIcon icon={faArrowRight} />
                </Control>
            </Controles>}
        </ContenedorPrincipal>
    );
}

const ContenedorPrincipal = styled.div`
    position: relative;
    overflow: hidden; /* Oculta el contenido que se desborda */
`;

const ContenedorSlideshow = styled.div`
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.5s ease;
`;

const Slide = styled.div`
    min-width: 33.333%; /* Muestra 3 slides a la vez */
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
`;

const Controles = styled.div`
    position: absolute;
    top: 50%;
    z-index: 20;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    transform: translateY(-50%);
`;

const Control = styled.div`
    pointer-events: all;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    width: 40px; /* Ajusta el ancho según sea necesario */
    height: 40px; /* Ajusta la altura según sea necesario */
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: none; /* Elimina la transición al pasar el cursor */

    /* Evita cualquier cambio visual en el estado hover */
    &:hover {
        background: none;
        color: inherit;
    }

    &:focus {
        outline: none;
    }

    path {
        filter: ${props => props.derecho ? 'drop-shadow(-2px 0px 0px #fff)' : 'drop-shadow(2px 0px 0px #fff)'};
    }

    ${props => props.derecho ? 'right: 10px;' : 'left: 10px;'}
`;

export { Slideshow, Slide };
